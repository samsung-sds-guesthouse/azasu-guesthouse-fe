document.addEventListener('DOMContentLoaded', async () => {
  checkUser();

  const reservationList = document.getElementById('reservation-list');
  const paginationContainer = document.getElementById('pagination');
  const EMPTY_MESSAGE = '예약 내역이 없습니다.';

  function formatDateTime(value) {
    if (!value) {
      return '-';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return escapeHTML(value);
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}`;
  }

  function formatStayPeriod(checkIn, checkOut) {
    if (!checkIn && !checkOut) {
      return '-';
    }

    return `${formatDateTime(checkIn)} ~ ${formatDateTime(checkOut)}`;
  }

  function getStatusLabel(status) {
    if (status === 'CONFIRMED') {
      return '승인';
    }

    if (status === 'CANCELLED') {
      return '취소';
    }

    return '대기';
  }

  function isCancelableStatus(status) {
    return status === 'PENDING' || status === 'CONFIRMED';
  }

  function renderEmptyState() {
    reservationList.innerHTML = `
            <article class="reservation-empty">
                <span class="reservation-empty-eyebrow">No Reservation</span>
                <h2>예약 내역이 없습니다.</h2>
                <p>${EMPTY_MESSAGE}</p>
            </article>
        `;
    paginationContainer.innerHTML = '';
  }

  function renderPagination(currentPage, maxPage) {
    if (maxPage <= 1) {
      paginationContainer.innerHTML = '';
      return;
    }

    const buttons = [];

    buttons.push(`
            <button
                type="button"
                class="page-btn"
                data-page="${currentPage - 1}"
                ${currentPage <= 1 ? 'disabled' : ''}
            >
                이전
            </button>
        `);

    for (let page = 1; page <= maxPage; page += 1) {
      buttons.push(`
                <button
                    type="button"
                    class="page-btn ${page === currentPage ? 'is-active' : ''}"
                    data-page="${page}"
                >
                    ${page}
                </button>
            `);
    }

    buttons.push(`
            <button
                type="button"
                class="page-btn"
                data-page="${currentPage + 1}"
                ${currentPage >= maxPage ? 'disabled' : ''}
            >
                다음
            </button>
        `);

    paginationContainer.innerHTML = buttons.join('');
    paginationContainer.querySelectorAll('.page-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const nextPage = Number(button.dataset.page);

        if (
          !nextPage ||
          nextPage === currentPage ||
          nextPage < 1 ||
          nextPage > maxPage
        ) {
          return;
        }

        loadReservations(nextPage);
      });
    });
  }

  function renderReservations(reservations) {
    reservationList.innerHTML = '';

    reservations.forEach((reservation) => {
      const item = document.createElement('article');
      item.className = 'reservation-item';
      item.innerHTML = `
                <a href="room-detail.html?id=${reservation.room_id}" class="reservation-image-link">
                    <img src="${getRoomImageSource(reservation.picture)}" alt="${escapeHTML(reservation.room_name)}">
                </a>
                <div class="reservation-body">
                    <div class="reservation-topline">
                        <p class="reservation-date">예약일 ${formatDateTime(reservation.reservation_date)}</p>
                        <span class="reservation-status status-${reservation.status.toLowerCase()}">${getStatusLabel(reservation.status)}</span>
                    </div>
                    <h4><a href="room-detail.html?id=${reservation.room_id}">${escapeHTML(reservation.room_name)}</a></h4>
                    <div class="reservation-meta">
                        <div class="reservation-meta-item">
                            <span class="reservation-meta-label">숙박 일정</span>
                            <strong>${formatStayPeriod(reservation.check_in, reservation.check_out)}</strong>
                        </div>
                        <div class="reservation-meta-item">
                            <span class="reservation-meta-label">인원</span>
                            <strong>${reservation.guest_count}명</strong>
                        </div>
                        <div class="reservation-meta-item">
                            <span class="reservation-meta-label">결제 금액</span>
                            <strong>${reservation.total_price.toLocaleString()}원</strong>
                        </div>
                    </div>
                </div>
                ${
                  isCancelableStatus(reservation.status)
                    ? `
                    <div class="reservation-actions">
                        <button type="button" class="cancel-btn" data-id="${reservation.id}">예약 취소</button>
                    </div>
                `
                    : '<div class="reservation-actions"></div>'
                }
            `;
      reservationList.appendChild(item);
    });

    reservationList.querySelectorAll('.cancel-btn').forEach((button) => {
      button.addEventListener('click', async (event) => {
        const cancelButton = event.currentTarget;
        const reservationId = cancelButton.dataset.id;
        const confirmation = confirm('정말 예약을 취소하시겠습니까?');

        if (!confirmation) {
          return;
        }

        try {
          cancelButton.disabled = true;
          await cancelReservation(reservationId);

          const reservationItem = cancelButton.closest('.reservation-item');
          const statusElement = reservationItem.querySelector(
            '.reservation-status',
          );
          statusElement.textContent = '취소';
          statusElement.className = 'reservation-status status-cancelled';
          cancelButton.remove();
          alert('예약이 취소되었습니다.');
        } catch (error) {
          alert('예약 취소에 실패했습니다.');
          cancelButton.disabled = false;
        }
      });
    });
  }

  async function loadReservations(page) {
    try {
      const result = await getMyReservations(page);

      if (!result.list.length) {
        renderEmptyState();
        return;
      }

      renderReservations(result.list);
      renderPagination(result.current_page, result.max_page);
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        alert('로그인이 필요합니다.');
        window.location.href = 'login.html';
        return;
      }

      renderEmptyState();
    }
  }

  loadReservations(1);
});
