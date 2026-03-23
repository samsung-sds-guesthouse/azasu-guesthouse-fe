document.addEventListener('DOMContentLoaded', () => {
    const roomDetailContainer = document.getElementById('room-detail-container');
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('id');

    if (!roomId) {
        roomDetailContainer.innerHTML = '<p>객실 정보를 찾을 수 없습니다.</p>';
        return;
    }

    getRoomDetail(roomId).then(room => {
        document.title = `${escapeHTML(room.name)} - Azasu Guesthouse`; // Update page title
        roomDetailContainer.innerHTML = `
            <div class="room-detail-image">
                <img src="${escapeHTML(room.image)}" alt="${escapeHTML(room.name)}">
            </div>
            <div class="room-detail-info">
                <h1>${escapeHTML(room.name)}</h1>
                <p>${escapeHTML(room.description)}</p>
                <ul>
                    <li><strong>최대 인원:</strong> ${room.max_guests}명</li>
                    <li><strong>가격:</strong> ${room.price.toLocaleString()}원 / 1박</li>
                    <li><strong>이용 규칙:</strong> ${escapeHTML(room.rules)}</li>
                </ul>
                <div class="booking-form">
                    <h3>예약하기</h3>
                    <input type="date" id="checkin-date">
                    <input type="date" id="checkout-date">
                    <select id="booking-guests"></select>
                    <button id="reserve-btn" disabled>예약</button>
                </div>
            </div>
        `;
        
        // Populate guest count
        const guestSelect = document.getElementById('booking-guests');
        for (let i = 1; i <= room.max_guests; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i}명`;
            guestSelect.appendChild(option);
        }

        // TODO: Implement calendar with unavailable dates shaded
        // TODO: Add logic to enable reservation button
        // TODO: Implement reservation process (check login, show confirmation)

        document.getElementById('reserve-btn').addEventListener('click', () => {
            checkUser(); // from auth.js - redirects if not logged in
            const confirmation = confirm('보증금을 입금해야 최종적으로 예약이 완료됩니다. 정말 예약하시겠습니까? 보증금은 환불이 되지 않습니다.');
            if(confirmation) {
                // Dummy reservation
                alert('예약이 완료되었습니다 (상태: PENDING). 마이페이지로 이동합니다.');
                window.location.href = 'mypage.html';
            }
        });
        
        // Dummy logic to enable button
        document.getElementById('checkin-date').addEventListener('change', () => {
             document.getElementById('reserve-btn').disabled = false;
        });


    }).catch(error => {
        console.error(error);
        roomDetailContainer.innerHTML = `<p>${error.message}</p>`;
    });
});