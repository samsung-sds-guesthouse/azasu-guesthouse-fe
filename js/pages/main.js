document.addEventListener('DOMContentLoaded', () => {
  sessionStorage.setItem(
    'searchParams',
    JSON.stringify({ startDate: '', endDate: '', guests: 1 }),
  );

  const datePicker = flatpickr('#date-range', {
    mode: 'range',
    dateFormat: 'Y-m-d',
    minDate: new Date().fp_incr(1),
    maxDate: new Date().fp_incr(30), // 오늘 + 30일
    locale: {
      rangeSeparator: ' ~ ', //→ 에서 바꿨는데 확인해보기
    },
  });

  const roomListContainer = document.getElementById('room-list');
  const searchBtn = document.getElementById('search-btn');
  const guestCountSelect = document.getElementById('guest-count');

  for (let i = 1; i <= 10; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${i}명`;
    guestCountSelect.appendChild(option);
  }

  function renderRooms(response) {
    const rooms = response?.data?.rooms || response?.rooms || [];

    roomListContainer.innerHTML = '';

    if (rooms.length === 0) {
      roomListContainer.innerHTML = `
        <div class="empty-state">
          <p>조건에 맞는 객실이 없습니다.</p>
          <p>날짜와 인원을 변경해 다시 검색해보세요.</p>
        </div>`;
      return;
    }

    let cardIndex = 0;
    let room_num = 0;
    rooms.forEach((room) => {
      const isReverse = cardIndex % 2 !== 0;
      cardIndex++;
      room_num++;

      const roomId = room.room_id;
      const roomName = room.room_name || '';
      const capacity = Number(room.capacity || 0);
      const price = Number(room.price || 0);
      const imageSrc = getRoomImageSource(room.picture || '');

      const card = document.createElement('a');
      card.href = `room-detail.html?id=${roomId}`;
      card.className = `room-item${isReverse ? ' reverse' : ''}`;

      card.innerHTML = `
        <div class="room-img-wrap">
          <img src="${escapeHTML(imageSrc)}" alt="${escapeHTML(roomName)}" loading="lazy" />
          
        </div>
        <div class="room-info">
          <p class="room-number">Room ${room_num}</p>
          <h3 class="room-name">${escapeHTML(roomName)}</h3>
          <p class="room-desc"></p>
          <div class="room-amenities"></div>
          <div class="room-meta">
            <div class="room-meta-detail">
              <span>최대 ${capacity}인</span>
            </div>
            <div class="room-price">
              <p class="room-price-label">1박 요금</p>
              <span class="room-price-amount">${price.toLocaleString()}원</span>
            </div>
          </div>
          <span class="room-cta">자세히 보기</span>
        </div>
      `;

      roomListContainer.appendChild(card);
    });
  }

  function loadRooms(searchParams = {}) {
    getRooms(searchParams)
      .then(renderRooms)
      .catch(() => {
        roomListContainer.innerHTML = `
          <div class="empty-state">
            <p>객실 정보를 불러오지 못했습니다.</p>
            <p>잠시 후 다시 시도해주세요.</p>
          </div>`;
      });
  }

  loadRooms();

  searchBtn.addEventListener('click', () => {
    const dates = datePicker.selectedDates;
    const searchParams = {
      check_in: dates[0] ? formatDate(dates[0]) : '',
      check_out: dates[1] ? formatDate(dates[1]) : '',
      guest_count: guestCountSelect.value,
      startDate: dates[0] ? formatDate(dates[0]) : '',
      endDate: dates[1] ? formatDate(dates[1]) : '',
      guests: guestCountSelect.value,
    };

    sessionStorage.setItem(
      'searchParams',
      JSON.stringify({
        startDate: searchParams.startDate,
        endDate: searchParams.endDate,
        guests: searchParams.guests,
      }),
    );

    loadRooms(searchParams);
  });
});
