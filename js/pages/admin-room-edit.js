document.addEventListener('DOMContentLoaded', () => {
    checkAdmin();

    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('id');
    const form = document.getElementById('edit-room-form');

    if (!roomId) {
        document.querySelector('main').innerHTML = '<p>잘못된 접근입니다.</p>';
        return;
    }

    // Fetch room details and populate the form
    getRoomDetail(roomId).then(room => {
        document.getElementById('room-name').value = room.name;
        document.getElementById('current-image').textContent = room.image.split('/').pop();
        document.getElementById('room-guests').value = room.max_guests;
        document.getElementById('room-price').value = room.price;
        document.getElementById('room-description').value = room.description;
        document.getElementById('room-rules').value = room.rules;
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', document.getElementById('room-name').value);
        const imageFile = document.getElementById('room-image').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }
        formData.append('max_guests', document.getElementById('room-guests').value);
        formData.append('price', document.getElementById('room-price').value);
        formData.append('description', document.getElementById('room-description').value);
        formData.append('rules', document.getElementById('room-rules').value);

        // In real app: await updateRoom(roomId, formData);
        alert('객실이 성공적으로 수정되었습니다.');
        window.location.href = 'admin-dashboard.html';
    });
});
