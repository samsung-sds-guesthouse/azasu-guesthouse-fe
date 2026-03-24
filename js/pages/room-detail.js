document.addEventListener('DOMContentLoaded', () => {
  const roomDetailContainer = document.getElementById('room-detail-container');
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('id');

  if (!roomId) {
    roomDetailContainer.innerHTML = '<p>객실 정보를 찾을 수 없습니다.</p>';
    return;
  }

  getRoomDetail(roomId)
    .then((room) => {
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
      <input type="text" id="date-range" placeholder="날짜 선택">
      <div id="guest-counter">
        <button id="minus-btn">-</button>
        <span id="guest-count">1명</span>
        <button id="plus-btn">+</button>
      </div>
      <button id="reserve-btn" disabled>예약</button>
    </div>
  </div>
`;
      const datePicker = flatpickr('#date-range', {
        mode: 'range',
        dateFormat: 'Y-m-d',
        minDate: 'today',
        onChange: function (selectedDates) {
          document.getElementById('reserve-btn').disabled =
            selectedDates.length !== 2;
        },
      });
      const params = JSON.parse(sessionStorage.getItem('searchParams') || '{}');
      if (params.startDate && params.endDate) {
        datePicker.setDate([params.startDate, params.endDate]);
        // 버튼도 같이 활성화
        document.getElementById('reserve-btn').disabled = false;
      }
      // Populate guest count
      const minusBtn = document.getElementById('minus-btn');
      const plusBtn = document.getElementById('plus-btn');
      const guestCountDisplay = document.getElementById('guest-count');
      let guestCount = params.guests || 1;
      const maxGuests = room.max_guests;
      function updateDisplay() {
        guestCountDisplay.textContent = `${guestCount}명`;
      }
      updateDisplay();
      // 감소
      minusBtn.addEventListener('click', () => {
        if (guestCount > 1) {
          guestCount--;
          updateDisplay();
        }
      });

      // 증가
      plusBtn.addEventListener('click', () => {
        if (guestCount < maxGuests) {
          guestCount++;
          updateDisplay();
        }
      });

      // TODO: Implement calendar with unavailable dates shaded
      // TODO: Add logic to enable reservation button
      // TODO: Implement reservation process (check login, show confirmation)
      // 달력 1달 뒤는 못 누르게 해주기
      document.getElementById('reserve-btn').addEventListener('click', () => {
        checkUser(); // from auth.js - redirects if not logged in
        const confirmation = confirm(
          '보증금을 입금해야 최종적으로 예약이 완료됩니다. 정말 예약하시겠습니까? 보증금은 환불이 되지 않습니다.',
        );
        if (confirmation) {
          // Dummy reservation
          alert(
            '예약이 완료되었습니다 (상태: PENDING). 마이페이지로 이동합니다.',
          );
          window.location.href = 'mypage.html';
        }
      });

      // Dummy logic to enable button  날짜 선택 바꾸면서 일단 바꿔둠
      //document.getElementById('checkin-date').addEventListener('change', () => {
      //document.getElementById('reserve-btn').disabled = false;
      //});
    })
    .catch((error) => {
      console.error(error);
      roomDetailContainer.innerHTML = `<p>${error.message}</p>`;
    });
});
