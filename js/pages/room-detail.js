document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('room-detail-container');
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('id');

  if (!roomId) {
    container.innerHTML = '<div class="page-wrapper"><p>객실 정보를 찾을 수 없습니다.</p></div>';
    return;
  }

  getRoomDetail(roomId)
    .then((room) => {
      document.title = `${escapeHTML(room.name)} — Azasu Guesthouse`;

      const galleryHTML = (room.gallery || [])
        .map(src => `<img src="${escapeHTML(src)}" alt="${escapeHTML(room.name)}" loading="lazy" />`)
        .join('');

      const amenitiesHTML = (room.amenities || [])
        .map(a => `<div class="detail-amenity-item">${escapeHTML(a)}</div>`)
        .join('');

      container.innerHTML = `
        <!-- Hero -->
        <div class="detail-hero">
          <img src="${escapeHTML(room.image)}" alt="${escapeHTML(room.name)}" />
          <div class="detail-hero-overlay"></div>
          <div class="detail-hero-title">
            <span style="font-size:0.7rem;letter-spacing:0.3em;color:var(--gold-light);display:block;margin-bottom:0.7rem;text-transform:uppercase;">
              ${escapeHTML(room.name_en || room.category || '')}
            </span>
            <h1>${escapeHTML(room.name)}</h1>
          </div>
        </div>

        <!-- Body -->
        <div class="detail-body">

          <!-- Left: info -->
          <div class="detail-main">

            <!-- Gallery strip -->
            <div class="detail-gallery">${galleryHTML}</div>

            <h2>객실 소개</h2>
            <p class="detail-desc">${escapeHTML(room.description)}</p>

            <h2>객실 시설</h2>
            <div class="detail-amenity-grid">${amenitiesHTML}</div>

            <div class="detail-rules">
              <h3>이용 규칙</h3>
              <p>${escapeHTML(room.rules || '')}</p>
            </div>
          </div>

          <!-- Right: booking card -->
          <div>
            <div class="booking-card">
              <p class="booking-card-title">예약하기 · Reserve</p>
              <p class="booking-price">${room.price.toLocaleString()}<span style="font-size:1rem;color:var(--text-muted)">원</span></p>
              <p class="booking-price-note">1박 기준 · 세금 및 봉사료 포함</p>

              <div class="booking-divider"></div>

              <div class="booking-form">
                <label for="date-range">체크인 · 체크아웃</label>
                <input type="text" id="date-range" placeholder="날짜를 선택하세요" readonly />

                <label>인원</label>
                <div class="guest-counter">
                  <button type="button" id="minus-btn" aria-label="인원 감소">－</button>
                  <span id="guest-count">1명</span>
                  <button type="button" id="plus-btn" aria-label="인원 증가">＋</button>
                </div>

                <button id="reserve-btn" disabled>예약 신청</button>
              </div>

              <p class="booking-meta">
                날짜 선택 후 예약 신청이 가능합니다.<br>
                보증금 입금 완료 시 예약이 확정됩니다.
              </p>
            </div>

            <div style="padding:1.5rem 0;font-size:0.78rem;color:var(--text-muted);line-height:1.8;">
              <p style="margin-bottom:0.3rem;">· 최대 인원: <strong>${room.max_guests}명</strong></p>
              <p style="margin-bottom:0.3rem;">· 객실 면적: <strong>${escapeHTML(room.size || '-')}</strong></p>
              <p>· 층수: <strong>${escapeHTML(room.floor || '-')}</strong></p>
            </div>
          </div>
        </div>
      `;

      // Flatpickr
      const datePicker = flatpickr('#date-range', {
        mode: 'range',
        dateFormat: 'Y-m-d',
        minDate: 'today',
        locale: { rangeSeparator: ' → ' },
        disable: room.unavailable_dates || [],
        onChange: function (selectedDates) {
          document.getElementById('reserve-btn').disabled = selectedDates.length !== 2;
        },
      });

      const params = JSON.parse(sessionStorage.getItem('searchParams') || '{}');
      if (params.startDate && params.endDate) {
        datePicker.setDate([params.startDate, params.endDate]);
        document.getElementById('reserve-btn').disabled = false;
      }

      // Guest counter
      let guestCount = parseInt(params.guests) || 1;
      const maxGuests = room.max_guests;
      const guestDisplay = document.getElementById('guest-count');

      function updateDisplay() {
        guestDisplay.textContent = `${guestCount}명`;
      }
      updateDisplay();

      document.getElementById('minus-btn').addEventListener('click', () => {
        if (guestCount > 1) { guestCount--; updateDisplay(); }
      });
      document.getElementById('plus-btn').addEventListener('click', () => {
        if (guestCount < maxGuests) { guestCount++; updateDisplay(); }
      });

      document.getElementById('reserve-btn').addEventListener('click', () => {
        if (!checkUser()) return;
        const confirmation = confirm(
          '보증금을 입금해야 최종적으로 예약이 완료됩니다.\n보증금은 환불이 되지 않습니다.\n\n예약을 신청하시겠습니까?'
        );
        if (confirmation) {
          alert('예약 신청이 완료되었습니다 (상태: 대기중).\n예약 내역 페이지로 이동합니다.');
          window.location.href = 'reservation.html';
        }
      });
    })
    .catch((error) => {
      console.error(error);
      container.innerHTML = `<div class="page-wrapper"><p>${escapeHTML(error.message)}</p></div>`;
    });
});