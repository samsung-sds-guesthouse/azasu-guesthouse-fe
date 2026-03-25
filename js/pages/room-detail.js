document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('room-detail-container');
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('id');

  if (!roomId) {
    container.innerHTML =
      '<div class="page-wrapper"><p>객실 정보를 찾을 수 없습니다.</p></div>';
    return;
  }

  function getRoomImageSource(picture) {
    if (!picture) {
      return 'https://via.placeholder.com/1200x800?text=Room';
    }

    const trimmedPicture = picture.trim();

    if (
      trimmedPicture.startsWith('data:') ||
      trimmedPicture.startsWith('http://') ||
      trimmedPicture.startsWith('https://')
    ) {
      return trimmedPicture;
    }

    if (trimmedPicture.startsWith('/')) {
      if (trimmedPicture.startsWith('/9j/')) {
        return `data:image/jpeg;base64,${trimmedPicture}`;
      }

      return trimmedPicture;
    }

    if (trimmedPicture.startsWith('iVBOR')) {
      return `data:image/png;base64,${trimmedPicture}`;
    }

    if (trimmedPicture.startsWith('R0lGOD')) {
      return `data:image/gif;base64,${trimmedPicture}`;
    }

    if (trimmedPicture.startsWith('UklGR')) {
      return `data:image/webp;base64,${trimmedPicture}`;
    }

    return `data:image/jpeg;base64,${trimmedPicture}`;
  }

  getRoomDetail(roomId)
    .then((response) => {
      const room = response?.data?.room || response?.room;
      const reservedDates =
        response?.data?.reserved_dates || response?.reserved_dates || [];

      if (!room) {
        throw new Error('객실 정보를 찾을 수 없습니다.');
      }

      const roomName = room.room_name || '';
      const roomPrice = Number(room.price || 0);
      const roomCapacity = Number(room.capacity || 0);
      const roomDescription = room.description || '';
      const roomPolicy = room.policy || '';
      const roomImage = getRoomImageSource(room.picture || '');

      document.title = `${escapeHTML(roomName)} | Azasu Guesthouse`;

      container.innerHTML = `
        <div class="detail-hero">
          <img src="${escapeHTML(roomImage)}" alt="${escapeHTML(roomName)}" />
          <div class="detail-hero-overlay"></div>
          <div class="detail-hero-title">
            <span style="font-size:0.7rem;letter-spacing:0.3em;color:var(--gold-light);display:block;margin-bottom:0.7rem;text-transform:uppercase;">
              Room ${room.room_id}
            </span>
            <h1>${escapeHTML(roomName)}</h1>
          </div>
        </div>

        <div class="detail-body">
          <div class="detail-main">
            <div class="detail-gallery">
              <img src="${escapeHTML(roomImage)}" alt="${escapeHTML(roomName)}" loading="lazy" />
            </div>

            <h2>객실 소개</h2>
            <p class="detail-desc">${escapeHTML(roomDescription)}</p>

            <h2>객실 정보</h2>
            <div class="detail-amenity-grid">
              <div class="detail-amenity-item">객실 번호: ${escapeHTML(String(room.room_id || '-'))}</div>
              <div class="detail-amenity-item">최대 인원: ${escapeHTML(String(roomCapacity || '-'))}명</div>
              <div class="detail-amenity-item">1박 요금: ${escapeHTML(roomPrice.toLocaleString())}원</div>
            </div>

            <div class="detail-rules">
              <h3>이용 규칙</h3>
              <p>${escapeHTML(roomPolicy)}</p>
            </div>
          </div>

          <div>
            <div class="booking-card">
              <p class="booking-card-title">예약하기 · Reserve</p>
              <p class="booking-price">${roomPrice.toLocaleString()}<span style="font-size:1rem;color:var(--text-muted)">원</span></p>
              <p class="booking-price-note">1박 기준 · 세금 및 봉사료 포함</p>

              <div class="booking-divider"></div>

              <div class="booking-form">
                <label for="date-range">체크인 · 체크아웃</label>
                <input type="text" id="date-range" placeholder="날짜를 선택하세요" readonly />

                <label>인원</label>
                <div class="guest-counter">
                  <button type="button" id="minus-btn" aria-label="인원 감소">-</button>
                  <span id="guest-count">1명</span>
                  <button type="button" id="plus-btn" aria-label="인원 증가">+</button>
                </div>

                <button id="reserve-btn" disabled>예약 신청</button>
              </div>

              <p class="booking-meta">
                날짜 선택 후 예약 신청이 가능합니다.<br>
                보증금 입금 완료 후 예약이 확정됩니다.
              </p>
            </div>

            <div style="padding:1.5rem 0;font-size:0.78rem;color:var(--text-muted);line-height:1.8;">
              <p style="margin-bottom:0.3rem;">· 최대 인원: <strong>${roomCapacity}명</strong></p>
              <p style="margin-bottom:0.3rem;">· 객실 번호: <strong>${escapeHTML(String(room.room_id || '-'))}</strong></p>
              <p>· 이용 정책: <strong>${escapeHTML(roomPolicy || '-')}</strong></p>
            </div>
          </div>
        </div>
      `;

      const reserveButton = document.getElementById('reserve-btn');
      const params = JSON.parse(sessionStorage.getItem('searchParams') || '{}');

      const datePicker = flatpickr('#date-range', {
        mode: 'range',
        dateFormat: 'Y-m-d',
        minDate: 'today',
        maxDate: new Date().fp_incr(30),
        locale: { rangeSeparator: ' ~ ' },
        disable: reservedDates,
        onChange(selectedDates) {
          reserveButton.disabled = selectedDates.length !== 2;
        },
      });

      if (params.startDate && params.endDate) {
        datePicker.setDate([params.startDate, params.endDate]);
        reserveButton.disabled = false;
      }

      let guestCount = parseInt(params.guests, 10) || 1;
      const maxGuests = roomCapacity || 1;
      const guestDisplay = document.getElementById('guest-count');

      function updateDisplay() {
        guestDisplay.textContent = `${guestCount}명`;
      }

      updateDisplay();

      document.getElementById('minus-btn').addEventListener('click', () => {
        if (guestCount > 1) {
          guestCount -= 1;
          updateDisplay();
        }
      });

      document.getElementById('plus-btn').addEventListener('click', () => {
        if (guestCount < maxGuests) {
          guestCount += 1;
          updateDisplay();
        }
      });

      reserveButton.addEventListener('click', async () => {
        if (!checkUser()) return;

        const selectedDates = datePicker.selectedDates;
        if (selectedDates.length !== 2) return;

        const checkIn = formatDate(selectedDates[0]);
        const checkOut = formatDate(selectedDates[1]);

        const confirmation = confirm(
          '보증금을 입금해야 최종적으로 예약이 완료됩니다.\n보증금은 환불되지 않습니다.\n\n예약을 신청하시겠습니까?',
        );

        if (!confirmation) return;

        try {
          await createReservation({
            room_id: Number(room.room_id),
            check_in: checkIn,
            check_out: checkOut,
            guest_count: guestCount,
          });

          alert(
            '예약 신청이 완료되었습니다.(상태: 대기중)\n예약 내역 페이지로 이동합니다.',
          );
          window.location.href = 'reservation.html';
        } catch (error) {
          console.error(error);
          alert(error.message || '예약 신청에 실패했습니다.');
        }
      });
    })
    .catch((error) => {
      console.error(error);
      container.innerHTML = `<div class="page-wrapper"><p>${escapeHTML(error.message)}</p></div>`;
    });
});
