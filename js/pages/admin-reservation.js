document.addEventListener('DOMContentLoaded', async () => {
    checkAdmin();

    const reservationListContainer = document.getElementById('admin-reservation-list');

    const RESERVATION_STATUS_LABELS = {
        PENDING: '대기',
        CONFIRMED: '확인',
        CANCELLED: '취소',
    };

    function renderMessage(message) {
        reservationListContainer.innerHTML = `<p>${escapeHTML(message)}</p>`;
    }

    function renderReservationStatusOptions(selectedStatus) {
        return Object.entries(RESERVATION_STATUS_LABELS)
            .map(([status, label]) => `
                <option value="${status}" ${selectedStatus === status ? 'selected' : ''}>
                    ${label}
                </option>
            `)
            .join('');
    }

    function renderReservations(reservations) {
        if (reservations.length === 0) {
            renderMessage('예약 내역이 없습니다.');
            return;
        }

        reservationListContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>객실명</th>
                        <th>인원</th>
                        <th>가격</th>
                        <th>예약 날짜</th>
                        <th>게스트 이름</th>
                        <th>게스트 연락처</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    ${reservations.map((reservation) => `
                        <tr>
                            <td>${escapeHTML(reservation.roomName)}</td>
                            <td>${reservation.guestCount}</td>
                            <td>${reservation.totalPrice.toLocaleString()}원</td>
                            <td>${escapeHTML(reservation.dateText)}</td>
                            <td>${escapeHTML(reservation.guestName)}</td>
                            <td>${escapeHTML(reservation.guestPhone)}</td>
                            <td>
                                <select
                                    data-id="${reservation.id}"
                                    data-previous-status="${reservation.status}"
                                >
                                    ${renderReservationStatusOptions(reservation.status)}
                                </select>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    async function loadReservations() {
        renderMessage('예약 목록을 불러오는 중...');

        try {
            const reservationData = await getAllReservations();
            const reservations = (reservationData.reservations || []).map(normalizeAdminReservation);
            renderReservations(reservations);
        } catch (error) {
            renderMessage(error.message || '예약 목록을 불러오지 못했습니다.');
        }
    }

    async function handleReservationStatusChange(select) {
        const reservationId = select.dataset.id;
        const nextStatus = select.value;
        const previousStatus = select.dataset.previousStatus || '';

        select.disabled = true;

        try {
            await updateReservationStatus(reservationId, nextStatus);
            await loadReservations();
            alert(`예약 ID ${reservationId}의 상태가 ${nextStatus}(으)로 변경되었습니다.`);
        } catch (error) {
            select.value = previousStatus;
            alert(error.message || '예약 상태 변경에 실패했습니다.');
        } finally {
            select.disabled = false;
        }
    }

    reservationListContainer.addEventListener('change', async (event) => {
        const target = event.target;
        if (!(target instanceof HTMLSelectElement)) {
            return;
        }

        if (!target.matches('select[data-id]')) {
            return;
        }

        await handleReservationStatusChange(target);
    });

    await loadReservations();
});
