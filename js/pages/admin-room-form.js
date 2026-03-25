function initAdminRoomForm(options = {}) {
  checkAdmin();

  const mode = options.mode === "edit" ? "edit" : "add";
  const formSelector = options.formSelector || "form";
  const redirectUrl = options.redirectUrl || "admin-dashboard.html";
  const form = document.querySelector(formSelector);

  if (!form) {
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const room_nameInput = document.getElementById("room-name");
  const roomImageInput = document.getElementById("room-image");
  const roomGuestsInput = document.getElementById("room-guests");
  const roomPriceInput = document.getElementById("room-price");
  const roomDescriptionInput = document.getElementById("room-description");
  const roomRulesInput = document.getElementById("room-rules");
  const currentImageElement = document.getElementById("current-image");
  const imagePreview = document.getElementById("room-image-preview");
  const imagePreviewImg = document.getElementById("room-image-preview-img");
  const imagePlaceholder = document.getElementById("room-image-placeholder");
  const imageStatus = document.getElementById("room-image-status");
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = mode === "edit" ? urlParams.get("id") : null;
  const MIN_ROOM_CAPACITY = 1;
  const MAX_ROOM_CAPACITY = 10;
  const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024;
  const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
  let objectUrl = "";

  if (roomImageInput) {
    roomImageInput.required = mode === "add";
  }

  if (roomGuestsInput) {
    roomGuestsInput.min = String(MIN_ROOM_CAPACITY);
    roomGuestsInput.max = String(MAX_ROOM_CAPACITY);
  }

  if (mode === "edit" && !roomId) {
    document.querySelector("main").innerHTML = "<p>Invalid room id.</p>";
    return;
  }

  function normalizeRoomDetail(room) {
    return {
      id: room.id ?? room.roomId ?? room.room_id ?? "",
      room_name: room.room_name || room.room_name || room.name || "",
      picture: room.picture || room.image || "",
      capacity: room.capacity ?? room.max_guests ?? "",
      price: room.price ?? "",
      description: room.description || "",
      policy: room.policy || room.rules || "",
    };
  }

  function revokeObjectUrl() {
    if (!objectUrl) {
      return;
    }

    URL.revokeObjectURL(objectUrl);
    objectUrl = "";
  }

  function setEmptyPreview(statusText) {
    revokeObjectUrl();

    if (imagePreview) {
      imagePreview.dataset.empty = "true";
    }

    if (imagePreviewImg) {
      imagePreviewImg.hidden = true;
      imagePreviewImg.removeAttribute("src");
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

    imagePreview.dataset.empty = "false";
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
      return "image/jpeg";
    }

    if (base64Value.startsWith("/9j/")) {
      return "image/jpeg";
    }

    if (base64Value.startsWith("iVBORw0KGgo")) {
      return "image/png";
    }

    if (base64Value.startsWith("R0lGOD")) {
      return "image/gif";
    }

    if (base64Value.startsWith("UklGR")) {
      return "image/webp";
    }

    return "image/jpeg";
  }

  function buildPreviewSource(pictureValue) {
    if (!pictureValue) {
      return "";
    }

    if (
      pictureValue.startsWith("data:image/") ||
      pictureValue.startsWith("blob:") ||
      pictureValue.startsWith("http")
    ) {
      return pictureValue;
    }

    const mimeType = detectImageMimeType(pictureValue);
    return `data:${mimeType};base64,${pictureValue}`;
  }

  function getImageValidationError(file) {
    if (!file) {
      return "";
    }

    const extension = file.name.includes(".")
      ? file.name.split(".").pop().toLowerCase()
      : "";
    const isAllowedExtension = ALLOWED_IMAGE_EXTENSIONS.includes(extension);
    const isAllowedMimeType = ALLOWED_IMAGE_TYPES.includes(file.type);

    if (!isAllowedExtension || !isAllowedMimeType) {
      return "이미지는 jpg, jpeg, png, webp 형식만 업로드할 수 있습니다.";
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return "이미지 용량은 15MB 이하여야 합니다.";
    }

    return "";
  }

  async function isSupportedImageSignature(file) {
    if (!file) {
      return false;
    }

    const headerBuffer = await file.slice(0, 12).arrayBuffer();
    const headerBytes = new Uint8Array(headerBuffer);

    const isJpeg =
      headerBytes.length >= 3 &&
      headerBytes[0] === 0xff &&
      headerBytes[1] === 0xd8 &&
      headerBytes[2] === 0xff;

    const isPng =
      headerBytes.length >= 8 &&
      headerBytes[0] === 0x89 &&
      headerBytes[1] === 0x50 &&
      headerBytes[2] === 0x4e &&
      headerBytes[3] === 0x47 &&
      headerBytes[4] === 0x0d &&
      headerBytes[5] === 0x0a &&
      headerBytes[6] === 0x1a &&
      headerBytes[7] === 0x0a;

    const isWebp =
      headerBytes.length >= 12 &&
      String.fromCharCode(...headerBytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...headerBytes.slice(8, 12)) === "WEBP";

    return isJpeg || isPng || isWebp;
  }

  function populateForm(room) {
    const roomDetail = normalizeRoomDetail(room);
    const hasPicture = Boolean(roomDetail.picture);
    const pictureLabel = hasPicture ? "registered image" : "-";
    const previewSource = buildPreviewSource(roomDetail.picture);

    room_nameInput.value = roomDetail.room_name;
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

    setEmptyPreview("No registered image.");
  }

  async function handleImageChange() {
    const imageFile = roomImageInput.files[0];

    if (!imageFile) {
      const fallbackMessage =
        mode === "edit"
          ? "Using the current registered image."
          : "No image selected yet.";

      if (
        mode === "edit" &&
        currentImageElement &&
        currentImageElement.textContent !== "-"
      ) {
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

    const imageValidationError = getImageValidationError(imageFile);
    if (imageValidationError) {
      roomImageInput.value = "";

      if (
        mode === "edit" &&
        currentImageElement &&
        currentImageElement.textContent !== "-"
      ) {
        const currentImageSrc = imagePreviewImg?.dataset.originalSrc;
        if (currentImageSrc) {
          updateImagePreview({
            src: currentImageSrc,
            statusText: `Current image: ${currentImageElement.textContent}`,
          });
        } else {
          setEmptyPreview("Using the current registered image.");
        }
      } else {
        setEmptyPreview("No image selected yet.");
      }

      alert(imageValidationError);
      return;
    }

    const hasValidImageSignature = await isSupportedImageSignature(imageFile);
    if (!hasValidImageSignature) {
      roomImageInput.value = "";

      if (
        mode === "edit" &&
        currentImageElement &&
        currentImageElement.textContent !== "-"
      ) {
        const currentImageSrc = imagePreviewImg?.dataset.originalSrc;
        if (currentImageSrc) {
          updateImagePreview({
            src: currentImageSrc,
            statusText: `Current image: ${currentImageElement.textContent}`,
          });
        } else {
          setEmptyPreview("Using the current registered image.");
        }
      } else {
        setEmptyPreview("No image selected yet.");
      }

      alert("파일 내용을 확인할 수 없거나 지원하지 않는 이미지 형식입니다.");
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

    formData.append("room_name", room_nameInput.value.trim());
    formData.append("capacity", roomGuestsInput.value);
    formData.append("price", roomPriceInput.value);
    formData.append("description", roomDescriptionInput.value.trim());
    formData.append("policy", roomRulesInput.value.trim());

    const imageFile = roomImageInput.files[0];
    if (imageFile) {
      formData.append("picture", imageFile);
    }

    return formData;
  }

  function validateRoomCapacity() {
    const capacityValue = Number(roomGuestsInput.value);
    const isValidCapacity =
      Number.isInteger(capacityValue) &&
      capacityValue >= MIN_ROOM_CAPACITY &&
      capacityValue <= MAX_ROOM_CAPACITY;

    if (isValidCapacity) {
      roomGuestsInput.setCustomValidity("");
      return true;
    }

    roomGuestsInput.setCustomValidity(
      `인원수는 ${MIN_ROOM_CAPACITY}명부터 ${MAX_ROOM_CAPACITY}명까지 입력할 수 있습니다.`,
    );
    roomGuestsInput.reportValidity();
    return false;
  }

  async function loadRoomDetail() {
    try {
      const room = await getAdminRoom(roomId);

      if (!room) {
        throw new Error("Room detail is empty");
      }

      populateForm(room);
      if (imagePreviewImg && imagePreviewImg.src) {
        imagePreviewImg.dataset.originalSrc = imagePreviewImg.src;
      }
    } catch (error) {
      document.querySelector("main").innerHTML =
        "<p>Failed to load room details. Please return to the dashboard and try again.</p>";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validateRoomCapacity()) {
      return;
    }
    const confirmationMessage =
      mode === "edit"
        ? "현재 입력한 내용으로 객실 정보를 수정하시겠습니까?"
        : "현재 입력한 내용으로 객실을 등록하시겠습니까?";

    if (!window.confirm(confirmationMessage)) {
      return;
    }

    submitButton.disabled = true;

    try {
      const formData = buildRoomFormData();

      if (mode === "edit") {
        await updateRoom(roomId, formData);
        alert("Room updated successfully.");
      } else {
        await createRoom(formData);
        alert("Room created successfully.");
      }

      window.location.href = redirectUrl;
    } catch (error) {
      const fallbackMessage =
        mode === "edit"
          ? "Failed to update the room."
          : "Failed to create the room.";
      alert(error.message || fallbackMessage);
    } finally {
      submitButton.disabled = false;
    }
  }

  form.addEventListener("submit", handleSubmit);
  roomImageInput.addEventListener("change", handleImageChange);
  roomGuestsInput.addEventListener("input", () => {
    roomGuestsInput.setCustomValidity("");
  });

  if (mode === "edit") {
    loadRoomDetail();
    return;
  }

  setEmptyPreview("No image selected yet.");
}
