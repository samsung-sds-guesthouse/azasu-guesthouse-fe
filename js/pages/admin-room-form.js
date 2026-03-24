function initAdminRoomForm(options = {}) {
    checkAdmin();

    const ROOM_EDIT_DRAFT_KEY = 'adminRoomEditDraft';
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
            id: room.id ?? room.roomId ?? '',
            roomName: room.roomName || room.room_name || room.name || '',
            picture: room.picture || room.image || '',
            capacity: room.capacity || room.max_guests || '',
            price: room.price || '',
            description: room.description || '',
            policy: room.policy || room.rules || '',
        };
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

    function detectImageMimeType(base64Value) {
        if (!base64Value) {
            return 'image/jpeg';
        }

        if (base64Value.startsWith('/9j/')) {
            return 'image/jpeg';
        }

        if (base64Value.startsWith('iVBORw0KGgo')) {
            return 'image/png';
        }

        if (base64Value.startsWith('R0lGOD')) {
            return 'image/gif';
        }

        if (base64Value.startsWith('UklGR')) {
            return 'image/webp';
        }

        return 'image/jpeg';
    }

    function buildPreviewSource(pictureValue) {
        if (!pictureValue) {
            return '';
        }

        if (
            pictureValue.startsWith('data:image/')
            || pictureValue.startsWith('blob:')
            || pictureValue.startsWith('http')
        ) {
            return pictureValue;
        }

        const mimeType = detectImageMimeType(pictureValue);
        return `data:${mimeType};base64,${pictureValue}`;
    }

    function populateForm(room) {
        const roomDetail = normalizeRoomDetail(room);
        const hasPicture = Boolean(roomDetail.picture);
        const pictureLabel = hasPicture ? '등록된 이미지' : '-';
        const previewSource = buildPreviewSource(roomDetail.picture);

        roomNameInput.value = roomDetail.roomName;
        roomGuestsInput.value = roomDetail.capacity;
        roomPriceInput.value = roomDetail.price;
        roomDescriptionInput.value = roomDetail.description;
        roomRulesInput.value = roomDetail.policy;

        if (currentImageElement) {
            currentImageElement.textContent = pictureLabel;
        }

        if (previewSource) {
            updateImagePreview({
                src: previewSource,
                statusText: `현재 등록된 이미지: ${pictureLabel}`,
            });
            return;
        }

        setEmptyPreview('등록된 이미지가 없습니다.');
    }

    function getStoredRoomDraft() {
        const rawDraft = sessionStorage.getItem(ROOM_EDIT_DRAFT_KEY);
        if (!rawDraft) {
            return null;
        }

        try {
            return JSON.parse(rawDraft);
        } catch (error) {
            sessionStorage.removeItem(ROOM_EDIT_DRAFT_KEY);
            return null;
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

        formData.append('roomName', roomNameInput.value.trim());
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

    function loadRoomDetail() {
        const storedRoom = getStoredRoomDraft();

        if (!storedRoom || String(storedRoom.id ?? storedRoom.roomId ?? '') !== String(roomId)) {
            document.querySelector('main').innerHTML = '<p>객실 정보를 불러오지 못했습니다. 대시보드에서 다시 진입해 주세요.</p>';
            return;
        }

        populateForm(storedRoom);
        if (imagePreviewImg && imagePreviewImg.src) {
            imagePreviewImg.dataset.originalSrc = imagePreviewImg.src;
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        submitButton.disabled = true;

        try {
            const formData = buildRoomFormData();

            if (mode === 'edit') {
                await updateRoom(roomId, formData);
                sessionStorage.removeItem(ROOM_EDIT_DRAFT_KEY);
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
