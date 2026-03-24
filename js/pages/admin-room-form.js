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
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = mode === 'edit' ? urlParams.get('id') : null;
    let objectUrl = '';

    if (roomImageInput) {
        roomImageInput.required = mode === 'add';
    }

    if (mode === 'edit' && !roomId) {
        document.querySelector('main').innerHTML = '<p>Invalid room id.</p>';
        return;
    }

    function normalizeRoomDetail(room) {
        return {
            id: room.id ?? room.roomId ?? room.room_id ?? '',
            roomName: room.roomName || room.room_name || room.name || '',
            picture: room.picture || room.image || '',
            capacity: room.capacity ?? room.max_guests ?? '',
            price: room.price ?? '',
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
        const pictureLabel = hasPicture ? 'registered image' : '-';
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
                statusText: `Current image: ${pictureLabel}`,
            });
            return;
        }

        setEmptyPreview('No registered image.');
    }

    function handleImageChange() {
        const imageFile = roomImageInput.files[0];

        if (!imageFile) {
            const fallbackMessage = mode === 'edit'
                ? 'Using the current registered image.'
                : 'No image selected yet.';

            if (mode === 'edit' && currentImageElement && currentImageElement.textContent !== '-') {
                const currentImageSrc = imagePreviewImg?.dataset.originalSrc;
                if (currentImageSrc) {
                    updateImagePreview({
                        src: currentImageSrc,
                        statusText: `Current image: ${currentImageElement.textContent}`,
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
            statusText: `Selected image: ${imageFile.name}`,
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

    async function loadRoomDetail() {
        try {
            const room = await getAdminRoom(roomId);

            if (!room) {
                throw new Error('Room detail is empty');
            }

            populateForm(room);
            if (imagePreviewImg && imagePreviewImg.src) {
                imagePreviewImg.dataset.originalSrc = imagePreviewImg.src;
            }
        } catch (error) {
            document.querySelector('main').innerHTML = '<p>Failed to load room details. Please return to the dashboard and try again.</p>';
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        submitButton.disabled = true;

        try {
            const formData = buildRoomFormData();

            if (mode === 'edit') {
                await updateRoom(roomId, formData);
                alert('Room updated successfully.');
            } else {
                await createRoom(formData);
                alert('Room created successfully.');
            }

            window.location.href = redirectUrl;
        } catch (error) {
            const fallbackMessage = mode === 'edit'
                ? 'Failed to update the room.'
                : 'Failed to create the room.';
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

    setEmptyPreview('No image selected yet.');
}
