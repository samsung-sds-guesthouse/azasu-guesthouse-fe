function initAdminRoomForm(options = {}) {
    checkAdmin();

    const mode = options.mode === 'edit' ? 'edit' : 'add';
    const formSelector = options.formSelector || 'form';
    const redirectUrl = options.redirectUrl || 'admin-dashboard.html';
    const form = document.querySelector(formSelector);

    if (!form) {
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const roomNameInput = document.getElementById('room-name');
    const roomImageInput = document.getElementById('room-image');
    const roomGuestsInput = document.getElementById('room-guests');
    const roomPriceInput = document.getElementById('room-price');
    const roomDescriptionInput = document.getElementById('room-description');
    const roomRulesInput = document.getElementById('room-rules');
    const currentImageElement = document.getElementById('current-image');
    const imagePreview = document.getElementById('room-image-preview');
    const imagePreviewImg = document.getElementById('room-image-preview-img');
    const imagePlaceholder = document.getElementById('room-image-placeholder');
    const imageStatus = document.getElementById('room-image-status');
    let objectUrl = '';

    if (roomImageInput) {
        roomImageInput.required = mode === 'add';
    }

    const urlParams = new URLSearchParams(window.location.search);
    const roomId = mode === 'edit' ? urlParams.get('id') : null;

    if (mode === 'edit' && !roomId) {
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

        roomNameInput.value = roomDetail.roomName;
        roomGuestsInput.value = roomDetail.capacity;
        roomPriceInput.value = roomDetail.price;
        roomDescriptionInput.value = roomDetail.description;
        roomRulesInput.value = roomDetail.policy;

        if (currentImageElement) {
            currentImageElement.textContent = pictureName;
        }

        if (roomDetail.picture) {
            updateImagePreview({
                src: roomDetail.picture,
                statusText: `현재 등록된 이미지: ${pictureName}`,
            });
            return;
        }

        setEmptyPreview('등록된 이미지가 없습니다.');
    }

    function revokeObjectUrl() {
        if (!objectUrl) {
            return;
        }

        URL.revokeObjectURL(objectUrl);
        objectUrl = '';
    }

    function setEmptyPreview(statusText) {
        revokeObjectUrl();

        if (imagePreview) {
            imagePreview.dataset.empty = 'true';
        }

        if (imagePreviewImg) {
            imagePreviewImg.hidden = true;
            imagePreviewImg.removeAttribute('src');
        }

        if (imagePlaceholder) {
            imagePlaceholder.hidden = false;
        }

        if (imageStatus) {
            imageStatus.textContent = statusText;
        }
    }

    function updateImagePreview({ src, statusText, fromObjectUrl = false }) {
        if (!imagePreview || !imagePreviewImg) {
            return;
        }

        if (!fromObjectUrl) {
            revokeObjectUrl();
        }

        imagePreview.dataset.empty = 'false';
        imagePreviewImg.src = src;
        imagePreviewImg.hidden = false;

        if (imagePlaceholder) {
            imagePlaceholder.hidden = true;
        }

        if (imageStatus) {
            imageStatus.textContent = statusText;
        }
    }

    function handleImageChange() {
        const imageFile = roomImageInput.files[0];

        if (!imageFile) {
            const fallbackMessage = mode === 'edit'
                ? '현재 등록된 이미지를 그대로 사용합니다.'
                : '아직 선택된 이미지가 없습니다.';

            if (mode === 'edit' && currentImageElement && currentImageElement.textContent !== '-') {
                const currentImageSrc = imagePreviewImg?.dataset.originalSrc;
                if (currentImageSrc) {
                    updateImagePreview({
                        src: currentImageSrc,
                        statusText: `현재 등록된 이미지: ${currentImageElement.textContent}`,
                    });
                    return;
                }
            }

            setEmptyPreview(fallbackMessage);
            return;
        }

        revokeObjectUrl();
        objectUrl = URL.createObjectURL(imageFile);
        updateImagePreview({
            src: objectUrl,
            statusText: `선택된 이미지: ${imageFile.name}`,
            fromObjectUrl: true,
        });
    }

    function buildRoomFormData() {
        const formData = new FormData();

        formData.append('room_name', roomNameInput.value.trim());
        formData.append('capacity', roomGuestsInput.value);
        formData.append('price', roomPriceInput.value);
        formData.append('description', roomDescriptionInput.value.trim());
        formData.append('policy', roomRulesInput.value.trim());

        const imageFile = roomImageInput.files[0];
        if (imageFile) {
            formData.append('picture', imageFile);
        }

        return formData;
    }

    async function loadRoomDetail() {
        try {
            const room = await getRoomDetail(roomId);
            populateForm(room);
            if (imagePreviewImg && imagePreviewImg.src) {
                imagePreviewImg.dataset.originalSrc = imagePreviewImg.src;
            }
        } catch (error) {
            document.querySelector('main').innerHTML = `<p>${escapeHTML(error.message || '객실 정보를 불러오지 못했습니다.')}</p>`;
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        submitButton.disabled = true;

        try {
            const formData = buildRoomFormData();

            if (mode === 'edit') {
                await updateRoom(roomId, formData);
                alert('객실이 성공적으로 수정되었습니다.');
            } else {
                await createRoom(formData);
                alert('객실이 성공적으로 추가되었습니다.');
            }

            window.location.href = redirectUrl;
        } catch (error) {
            const fallbackMessage = mode === 'edit'
                ? '객실 수정에 실패했습니다.'
                : '객실 추가에 실패했습니다.';
            alert(error.message || fallbackMessage);
        } finally {
            submitButton.disabled = false;
        }
    }

    form.addEventListener('submit', handleSubmit);
    roomImageInput.addEventListener('change', handleImageChange);

    if (mode === 'edit') {
        loadRoomDetail();
        return;
    }

    setEmptyPreview('아직 선택된 이미지가 없습니다.');
}
