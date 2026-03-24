document.addEventListener('DOMContentLoaded', () => {
  sessionStorage.setItem('searchParams', JSON.stringify({ startDate: '', endDate: '', guests: 1 }));

  const datePicker = flatpickr('#date-range', {
    mode: 'range',
    dateFormat: 'Y-m-d',
    minDate: 'today',
    locale: {
      rangeSeparator: ' → ',
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

  const CATEGORIES = {
    '스탠다드': '스탠다드 · Standard',
    '디럭스':   '디럭스 · Deluxe',
    '스위트':   '스위트 · Suite',
  };

  function renderRooms(rooms) {
    roomListContainer.innerHTML = '';

    if (rooms.length === 0) {
      roomListContainer.innerHTML = `
        <div class="empty-state">
          <p>조건에 맞는 객실이 없습니다.</p>
          <p>날짜나 인원을 변경해 다시 검색해보세요.</p>
        </div>`;
      return;
    }

    // Group by category, maintain order
    const order = ['스탠다드', '디럭스', '스위트'];
    const grouped = {};
    rooms.forEach(r => {
      const cat = r.category || '기타';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(r);
    });

    let cardIndex = 0;

    order.forEach(cat => {
      if (!grouped[cat] || grouped[cat].length === 0) return;

      const divider = document.createElement('div');
      divider.className = 'room-category';
      divider.innerHTML = `<span class="room-category-label">${CATEGORIES[cat] || cat}</span>`;
      roomListContainer.appendChild(divider);

      grouped[cat].forEach(room => {
        const isReverse = cardIndex % 2 !== 0;
        cardIndex++;

        const card = document.createElement('a');
        card.href = `room-detail.html?id=${room.id}`;
        card.className = `room-item${isReverse ? ' reverse' : ''}`;

        card.innerHTML = `
          <div class="room-img-wrap">
            <img src="${escapeHTML(room.image)}" alt="${escapeHTML(room.name)}" loading="lazy" />
            <span class="room-img-badge">${escapeHTML(room.size || '')} · 최대 ${room.max_guests}인</span>
          </div>
          <div class="room-info">
            <p class="room-number">${escapeHTML(room.name_en || '')}</p>
            <h3 class="room-name">${escapeHTML(room.name)}</h3>
            <p class="room-desc">${escapeHTML(room.description || '')}</p>
            <div class="room-amenities">
              ${(room.amenities || []).map(a => `<span class="amenity-tag">${escapeHTML(a)}</span>`).join('')}
            </div>
            <div class="room-meta">
              <div class="room-meta-detail">
                <span>최대 ${room.max_guests}인 · ${escapeHTML(room.size || '')} · ${escapeHTML(room.floor || '')}</span>
              </div>
              <div class="room-price">
                <p class="room-price-label">1박 요금</p>
                <span class="room-price-amount">${room.price.toLocaleString()}원</span>
              </div>
            </div>
            <span class="room-cta">자세히 보기</span>
          </div>
        `;

        roomListContainer.appendChild(card);
      });
    });
  }

  getRooms().then(renderRooms);

  searchBtn.addEventListener('click', () => {
    const dates = datePicker.selectedDates;
    const searchParams = {
      startDate: dates[0] ? formatDate(dates[0]) : '',
      endDate:   dates[1] ? formatDate(dates[1]) : '',
      guests: guestCountSelect.value,
    };
    sessionStorage.setItem('searchParams', JSON.stringify(searchParams));
    getRooms(searchParams).then(renderRooms);
  });
});