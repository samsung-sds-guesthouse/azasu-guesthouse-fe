document.addEventListener('DOMContentLoaded', () => {
    checkAdmin();

    const form = document.getElementById('add-room-form');
    const submitButton = form.querySelector('button[type="submit"]');

    function buildRoomFormData() {
        const formData = new FormData();
        formData.append('room_name', document.getElementById('room-name').value.trim());
        formData.append('picture', document.getElementById('room-image').files[0]);
        formData.append('capacity', document.getElementById('room-guests').value);
        formData.append('price', document.getElementById('room-price').value);
        formData.append('description', document.getElementById('room-description').value.trim());
        formData.append('policy', document.getElementById('room-rules').value.trim());
        return formData;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        submitButton.disabled = true;

        try {
            const formData = buildRoomFormData();
            await createRoom(formData);
            alert('객실이 성공적으로 추가되었습니다.');
            window.location.href = 'admin-dashboard.html';
        } catch (error) {
            alert(error.message || '객실 추가에 실패했습니다.');
        } finally {
            submitButton.disabled = false;
        }
    }

    form.addEventListener('submit', handleSubmit);
});
