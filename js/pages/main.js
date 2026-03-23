document.addEventListener('DOMContentLoaded', () => {
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
        rooms.forEach(room => {
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

    // Search functionality
    searchBtn.addEventListener('click', () => {
        const searchParams = {
            startDate: document.getElementById('start-date').value,
            endDate: document.getElementById('end-date').value,
            guests: guestCountSelect.value,
        };
        // In a real app, you'd pass these params to the API.
        getRooms(searchParams).then(renderRooms);
    });
});
