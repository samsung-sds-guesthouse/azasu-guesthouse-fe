document.addEventListener('DOMContentLoaded', async () => {
    checkAdmin(); // Redirect if not admin

    const reservationListContainer = document.getElementById('admin-reservation-list');

    // In a real app: const reservations = await getAllReservations();
    const reservations = [
         { id: 1, room_name: 'Deluxe Room', guests: 2, price: 300000, date: '2024-05-10 ~ 2024-05-12', status: 'CONFIRMED', guest_name: '홍길동', guest_phone: '010-1234-5678'},
        { id: 2, room_name: 'Standard Room', guests: 1, price: 100000, date: '2024-04-28', status: 'PENDING', guest_name: '김영희', guest_phone: '010-8765-4321' },
         { id: 3, room_name: 'Family Suite', guests: 4, price: 440000, date: '2024-03-15 ~ 2024-03-17', status: 'CANCELLED', guest_name: '이철수', guest_phone: '010-5555-4444' },
    ];

    reservationListContainer.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>객실명</th>
                    <th>인원</th>
                    <th>가격</th>
                    <th>예약 날짜</th>
                    <th>게스트 이름</th>
                    <th>게스트 연락처</th>
                    <th>상태</th>
                </tr>
            </thead>
            <tbody>
                ${reservations.map(res => `
                    <tr>
                        <td>${escapeHTML(res.room_name)}</td>
                        <td>${res.guests}</td>
                        <td>${res.price.toLocaleString()}원</td>
                        <td>${escapeHTML(res.date)}</td>
                        <td>${escapeHTML(res.guest_name)}</td>
                        <td>${escapeHTML(res.guest_phone)}</td>
                        <td>
                            <select data-id="${res.id}">
                                <option value="PENDING" ${res.status === 'PENDING' ? 'selected' : ''}>대기</option>
                                <option value="CONFIRMED" ${res.status === 'CONFIRMED' ? 'selected' : ''}>승인</option>
                                <option value="CANCELLED" ${res.status === 'CANCELLED' ? 'selected' : ''}>취소</option>
                            </select>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    // Add event listeners to select elements
    reservationListContainer.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', (e) => {
            const reservationId = e.target.dataset.id;
            const newStatus = e.target.value;
            // In a real app: await updateReservationStatus(reservationId, newStatus);
            console.log(`Updating reservation ${reservationId} to ${newStatus}`);
            alert(`예약 ID ${reservationId}의 상태가 ${newStatus}(으)로 변경되었습니다.`);
        });
    });
});