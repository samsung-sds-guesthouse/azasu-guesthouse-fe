document.addEventListener('DOMContentLoaded', () => {
  sessionStorage.setItem(
    'searchParams',
    JSON.stringify({ startDate: '', endDate: '', guests: 1 }),
  );
  const datePicker = flatpickr('#date-range', {
    mode: 'range',
    dateFormat: 'Y-m-d',
    minDate: 'today',
  });
  const roomListContainer = document.getElementById('room-list');
  const searchBtn = document.getElementById('search-btn');
  const guestCountSelect = document.getElementById('guest-count');

  // Populate guest count dropdown
  for (let i = 1; i <= 10; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${i}명`;
    guestCountSelect.appendChild(option);
  }

  // Function to render rooms
  function renderRooms(rooms) {
    roomListContainer.innerHTML = ''; // Clear existing list
    if (rooms.length === 0) {
      roomListContainer.innerHTML = '<p>예약 가능한 객실이 없습니다.</p>';
      return;
    }
    rooms.forEach((room) => {
      const roomElement = document.createElement('div');
      roomElement.className = 'room-item';
      // Use escapeHTML for safety, although dummy data is safe
      roomElement.innerHTML = `
                <a href="room-detail.html?id=${room.id}">
                    <img src="${escapeHTML(room.image)}" alt="${escapeHTML(room.name)}">
                    <h3>${escapeHTML(room.name)}</h3>
                    <p>최대 인원: ${room.max_guests}명</p>
                    <p>가격: ${room.price.toLocaleString()}원</p>
                </a>
            `;
      roomListContainer.appendChild(roomElement);
    });
  }

  // Initial load of all rooms
  getRooms().then(renderRooms);
  function formatDate(date) {
    return (
      date.getFullYear() +
      '-' +
      String(date.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(date.getDate()).padStart(2, '0')
    );
  }
  // Search functionality
  searchBtn.addEventListener('click', () => {
    const dates = datePicker.selectedDates;
    const searchParams = {
      startDate: dates[0] ? formatDate(dates[0]) : '',
      endDate: dates[1] ? formatDate(dates[1]) : '',
      guests: guestCountSelect.value,
    };
    sessionStorage.setItem('searchParams', JSON.stringify(searchParams));
    // In a real app, you'd pass these params to the API.
    getRooms(searchParams).then(renderRooms);
  });
});
