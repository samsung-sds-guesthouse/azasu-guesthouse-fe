document.addEventListener('DOMContentLoaded', async () => {
    checkUser(); // Redirect if not logged in

    const user = JSON.parse(sessionStorage.getItem('user'));

    // Populate user info
    document.getElementById('user-id').textContent = user.id; // In real app, this might be username
    document.getElementById('user-name').textContent = user.name;
    // document.getElementById('user-phone').textContent = user.phone; // Add phone to user object

    // Change password form
     document.getElementById('change-password-form').addEventListener('submit', (e) => {
        e.preventDefault();
        // In real app, call API to change password
        alert('비밀번호가 변경되었습니다.');
        e.target.reset();
    });

    // Delete account button
    document.getElementById('delete-account-btn').addEventListener('click', () => {
        const confirmation = confirm('예약 내역이 모두 삭제됩니다. 정말 탈퇴하겠습니까?');
        if (confirmation) {
            // In real app, call API to delete account
            alert('회원 탈퇴 처리되었습니다.');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token');
            window.location.href = '/';
        }
    });

    // Fetch and render reservations
    const reservationList = document.getElementById('reservation-list');
    const reservations = await getMyReservations();
    
    if (reservations.length === 0) {
        reservationList.innerHTML = '<p>예약 내역이 없습니다.</p>';
    } else {
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

        // Add event listeners for cancel buttons
        reservationList.querySelectorAll('.cancel-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const reservationId = e.target.dataset.id;
                const confirmation = confirm('정말 예약을 취소하시겠습니까?');
                if (confirmation) {
                    await cancelReservation(reservationId);
                    alert('예약이 취소되었습니다.');
                    // Visually update the status
                    e.target.closest('.reservation-item').querySelector('span').textContent = 'CANCELLED';
                    e.target.closest('.reservation-item').querySelector('span').className = 'status-cancelled';
                    e.target.remove();
                }
            });
        });
    }
});