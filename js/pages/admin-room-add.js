document.addEventListener('DOMContentLoaded', () => {
    checkAdmin(); // Redirect if not admin

    document.getElementById('add-room-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', document.getElementById('room-name').value);
        formData.append('image', document.getElementById('room-image').files[0]);
        formData.append('max_guests', document.getElementById('room-guests').value);
        formData.append('price', document.getElementById('room-price').value);
        formData.append('description', document.getElementById('room-description').value);
        formData.append('rules', document.getElementById('room-rules').value);

        // In a real app, you would send this to the API
        // await createRoom(formData); 
        
        alert('객실이 성공적으로 추가되었습니다.');
        window.location.href = 'admin-dashboard.html';
    });
});