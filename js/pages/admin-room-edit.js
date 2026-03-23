document.addEventListener('DOMContentLoaded', () => {
    checkAdmin();

    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('id');
    const form = document.getElementById('edit-room-form');
    const submitButton = form.querySelector('button[type="submit"]');

    if (!roomId) {
        document.querySelector('main').innerHTML = '<p>잘못된 접근입니다.</p>';
        return;
    }

    function normalizeRoomDetail(room) {
        return {
            roomName: room.room_name || room.name || '',
            picture: room.picture || room.image || '',
            capacity: room.capacity || room.max_guests || '',
            price: room.price || '',
            description: room.description || '',
            policy: room.policy || room.rules || '',
        };
    }

    function populateForm(room) {
        const roomDetail = normalizeRoomDetail(room);
        const pictureName = roomDetail.picture ? roomDetail.picture.split('/').pop() : '-';

        document.getElementById('room-name').value = roomDetail.roomName;
        document.getElementById('current-image').textContent = pictureName;
        document.getElementById('room-guests').value = roomDetail.capacity;
        document.getElementById('room-price').value = roomDetail.price;
        document.getElementById('room-description').value = roomDetail.description;
        document.getElementById('room-rules').value = roomDetail.policy;
    }

    function buildRoomFormData() {
        const formData = new FormData();
        formData.append('room_name', document.getElementById('room-name').value.trim());
        formData.append('capacity', document.getElementById('room-guests').value);
        formData.append('price', document.getElementById('room-price').value);
        formData.append('description', document.getElementById('room-description').value.trim());
        formData.append('policy', document.getElementById('room-rules').value.trim());

        const imageFile = document.getElementById('room-image').files[0];
        if (imageFile) {
            formData.append('picture', imageFile);
        }

        return formData;
    }

    async function loadRoomDetail() {
        try {
            const room = await getRoomDetail(roomId);
            populateForm(room);
        } catch (error) {
            document.querySelector('main').innerHTML = `<p>${escapeHTML(error.message || '객실 정보를 불러오지 못했습니다.')}</p>`;
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        submitButton.disabled = true;

        try {
            const formData = buildRoomFormData();
            await updateRoom(roomId, formData);
            alert('객실이 성공적으로 수정되었습니다.');
            window.location.href = 'admin-dashboard.html';
        } catch (error) {
            alert(error.message || '객실 수정에 실패했습니다.');
        } finally {
            submitButton.disabled = false;
        }
    }

    form.addEventListener('submit', handleSubmit);
    loadRoomDetail();
});
