document.addEventListener('DOMContentLoaded', () => {
    checkAdmin(); // Redirect if not admin

    const roomListContainer = document.getElementById('admin-room-list');

    async function loadRooms() {
        const rooms = await getRooms(); // Assuming getRooms fetches all rooms for admin
        roomListContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>객실명</th>
                        <th>최대 인원</th>
                        <th>가격</th>
                        <th>활성화</th>
                        <th>수정</th>
                    </tr>
                </thead>
                <tbody>
                    ${rooms.map(room => `
                        <tr>
                            <td>${escapeHTML(room.name)}</td>
                            <td>${room.max_guests}</td>
                            <td>${room.price.toLocaleString()}원</td>
                            <td>
                                <label class="switch">
                                    <input type="checkbox" ${room.is_active !== false ? 'checked' : ''} data-id="${room.id}">
                                    <span class="slider round"></span>
                                </label>
                            </td>
                            <td><a href="admin-room-edit.html?id=${room.id}" class="button">수정</a></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        // Add event listeners for toggles
        roomListContainer.querySelectorAll('.switch input').forEach(toggle => {
            toggle.addEventListener('change', async (e) => {
                const roomId = e.target.dataset.id;
                const isActive = e.target.checked;
                // In real app: await updateRoomStatus(roomId, isActive);
                console.log(`Room ${roomId} active status: ${isActive}`);
                alert(`객실 ID ${roomId}의 활성화 상태가 변경되었습니다.`);
            });
        });
    }

    loadRooms();
});