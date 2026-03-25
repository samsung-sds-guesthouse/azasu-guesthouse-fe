document.addEventListener('DOMContentLoaded', async () => {
    checkAdmin();

    const navigationEntries = performance.getEntriesByType('navigation');
    const navigationType = navigationEntries.length > 0 ? navigationEntries[0].type : '';
    if (navigationType === 'back_forward') {
        window.location.reload();
        return;
    }

    const roomListContainer = document.getElementById('admin-room-list');
    const reservationListContainer = document.getElementById('admin-reservation-list');
    const roomsSection = document.getElementById('admin-rooms-section');
    const reservationsSection = document.getElementById('admin-reservations-section');
    const navButtons = document.querySelectorAll('.admin-nav-btn');
    let currentRooms = [];
    let currentReservations = [];

    const SECTION = {
        ROOMS: 'rooms',
        RESERVATIONS: 'reservations',
    };

    const RESERVATION_STATUS_LABELS = {
        PENDING: '대기',
        CONFIRMED: '확인',
        CANCELLED: '취소',
    };

    function setActiveSection(sectionName) {
        const showRooms = sectionName === SECTION.ROOMS;
        roomsSection.hidden = !showRooms;
        reservationsSection.hidden = showRooms;

        navButtons.forEach((button) => {
            const isActive = button.dataset.section === sectionName;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });
    }

    function renderLoading(container, message) {
        container.innerHTML = `<p>${escapeHTML(message)}</p>`;
    }

    function renderEmpty(container, message) {
        container.innerHTML = `<p>${escapeHTML(message)}</p>`;
    }

    function renderError(container, message) {
        container.innerHTML = `<p>${escapeHTML(message)}</p>`;
    }

    function renderRooms(rooms) {
        if (rooms.length === 0) {
            renderEmpty(roomListContainer, '등록된 객실이 없습니다.');
            return;
        }

        roomListContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>객실명</th>
                        <th>최대 인원</th>
                        <th>가격</th>
                        <th>활성화</th>
                        <th>수정</th>
                    </tr>
                </thead>
                <tbody>
                    ${rooms.map((room) => `
                        <tr>
                            <td>${escapeHTML(room.roomName)}</td>
                            <td>${room.capacity}</td>
                            <td>${room.price.toLocaleString()}원</td>
                            <td>
                                <label class="switch">
                                    <input
                                        type="checkbox"
                                        data-id="${room.id}"
                                        ${room.isActive ? 'checked' : ''}
                                    >
                                    <span class="slider round"></span>
                                </label>
                            </td>
                            <td>
                                <a
                                    href="admin-room-edit.html?id=${room.id}"
                                    class="button"
                                    data-edit-room-id="${room.id}"
                                >
                                    수정
                                </a>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
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
            renderEmpty(reservationListContainer, '예약 내역이 없습니다.');
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
                        <th>예약자명</th>
                        <th>연락처</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    ${reservations.map((reservation) => `
                        <tr data-reservation-id="${reservation.id}">
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

    async function loadRooms() {
        renderLoading(roomListContainer, '객실 목록을 불러오는 중...');

        try {
            const rooms = await getAdminRooms();
            currentRooms = rooms.map(normalizeAdminRoom);
            renderRooms(currentRooms);
        } catch (error) {
            renderError(roomListContainer, error.message || '객실 목록을 불러오지 못했습니다.');
        }
    }

    async function loadReservations() {
        renderLoading(reservationListContainer, '예약 목록을 불러오는 중...');

        try {
            const reservationData = await getAllReservations();
            currentReservations = (reservationData.reservations || []).map(normalizeAdminReservation);
            renderReservations(currentReservations);
        } catch (error) {
            renderError(reservationListContainer, error.message || '예약 목록을 불러오지 못했습니다.');
        }
    }

    function handleRoomEditNavigation(link) {
        window.location.href = link.href;
    }

    async function handleRoomActivationChange(input) {
        const roomId = input.dataset.id;
        const nextValue = input.checked;
        const targetRoom = currentRooms.find((room) => String(room.id) === String(roomId));
        const previousValue = targetRoom ? targetRoom.isActive : !nextValue;

        input.disabled = true;

        try {
            await updateRoomActivation(roomId, nextValue);
            if (targetRoom) {
                targetRoom.isActive = nextValue;
            }
        } catch (error) {
            input.checked = !nextValue;
            if (targetRoom) {
                targetRoom.isActive = previousValue;
            }
            alert(error.message || '객실 활성화 상태 변경에 실패했습니다.');
        } finally {
            input.disabled = false;
        }
    }

    async function handleReservationStatusChange(select) {
        const reservationId = select.dataset.id;
        const nextStatus = select.value;
        const previousStatus = select.dataset.previousStatus || '';
        const targetReservation = currentReservations.find((reservation) => String(reservation.id) === String(reservationId));

        select.disabled = true;

        try {
            await updateReservationStatus(reservationId, nextStatus);
            if (targetReservation) {
                targetReservation.status = nextStatus;
            }
            select.dataset.previousStatus = nextStatus;
            alert(`예약 ID ${reservationId}의 상태가 ${nextStatus}(으)로 변경되었습니다.`);
        } catch (error) {
            select.value = previousStatus;
            if (targetReservation) {
                targetReservation.status = previousStatus;
            }
            alert(error.message || '예약 상태 변경에 실패했습니다.');
        } finally {
            select.disabled = false;
        }
    }

    async function handleSectionChange(sectionName) {
        setActiveSection(sectionName);

        if (sectionName === SECTION.ROOMS) {
            await loadRooms();
            return;
        }

        if (sectionName === SECTION.RESERVATIONS) {
            await loadReservations();
        }
    }

    function bindNavigationEvents() {
        navButtons.forEach((button) => {
            button.addEventListener('click', async () => {
                await handleSectionChange(button.dataset.section);
            });
        });
    }

    function bindPageVisibilityEvents() {
        window.addEventListener('pageshow', async (event) => {
            const pageNavigationEntries = performance.getEntriesByType('navigation');
            const pageNavigationType = pageNavigationEntries.length > 0 ? pageNavigationEntries[0].type : '';

            if (event.persisted || pageNavigationType === 'back_forward') {
                window.location.reload();
                return;
            }

            if (!roomsSection.hidden) {
                await loadRooms();
            }
        });

        document.addEventListener('visibilitychange', async () => {
            if (document.visibilityState !== 'visible') {
                return;
            }

            if (!roomsSection.hidden) {
                await loadRooms();
            }
        });
    }

    function bindDelegatedEvents() {
        roomListContainer.addEventListener('change', async (event) => {
            const target = event.target;
            if (!(target instanceof HTMLInputElement)) {
                return;
            }

            if (!target.matches('.switch input[data-id]')) {
                return;
            }

            await handleRoomActivationChange(target);
        });

        roomListContainer.addEventListener('click', (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) {
                return;
            }

            const link = target.closest('a[data-edit-room-id]');
            if (!(link instanceof HTMLAnchorElement)) {
                return;
            }

            event.preventDefault();
            handleRoomEditNavigation(link);
        });

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
    }

    bindNavigationEvents();
    bindPageVisibilityEvents();
    bindDelegatedEvents();
    setActiveSection(SECTION.ROOMS);
    await loadRooms();
});
