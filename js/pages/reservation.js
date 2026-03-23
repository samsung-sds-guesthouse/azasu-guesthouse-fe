document.addEventListener('DOMContentLoaded', async () => {
    checkUser();

    const reservationList = document.getElementById('reservation-list');
    const reservations = await getMyReservations();

    if (reservations.length === 0) {
        reservationList.innerHTML = '<p>예약 내역이 없습니다.</p>';
        return;
    }

    reservations.forEach(res => {
        const item = document.createElement('div');
        item.className = 'reservation-item';
        item.innerHTML = `
            <img src="${escapeHTML(res.image)}" alt="${escapeHTML(res.room_name)}">
            <div>
                <h4><a href="room-detail.html?id=${res.room_id}">${escapeHTML(res.room_name)}</a></h4>
                <p>인원: ${res.guests}명</p>
                <p>가격: ${res.price.toLocaleString()}원</p>
                <p>날짜: ${escapeHTML(res.date)}</p>
                <p>상태: <span class="status-${res.status.toLowerCase()}">${res.status}</span></p>
            </div>
            ${res.status === 'PENDING' || res.status === 'CONFIRMED' ? `<button class="cancel-btn" data-id="${res.id}">예약 취소</button>` : ''}
        `;
        reservationList.appendChild(item);
    });

    reservationList.querySelectorAll('.cancel-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const reservationId = e.target.dataset.id;
            const confirmation = confirm('정말 예약을 취소하시겠습니까?');

            if (!confirmation) {
                return;
            }

            await cancelReservation(reservationId);
            alert('예약이 취소되었습니다.');

            const reservationItem = e.target.closest('.reservation-item');
            const statusElement = reservationItem.querySelector('span');
            statusElement.textContent = 'CANCELLED';
            statusElement.className = 'status-cancelled';
            e.target.remove();
        });
    });
});
