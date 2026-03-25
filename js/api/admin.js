async function getAdminRooms() {
  const response = await fetchApi("/api/v1/admin/rooms");
  return response.data?.rooms || [];
}

async function getAdminRoom(roomId) {
  const response = await fetchApi(`/api/v1/admin/rooms/${roomId}`);
  return response.data?.room || null;
}

async function createRoom(roomFormData) {
  return fetchApi("/api/v1/admin/rooms", {
    method: "POST",
    body: roomFormData,
  });
}

async function updateRoom(roomId, roomFormData) {
  return fetchApi(`/api/v1/admin/rooms/${roomId}/modify`, {
    method: "POST",
    body: roomFormData,
  });
}

async function updateRoomActivation(roomId, isActive) {
  return fetchApi(
    `/api/v1/admin/rooms/${roomId}/activation?is_active=${encodeURIComponent(isActive)}`,
    {
      method: "POST",
    },
  );
}

async function getAllReservations(page = 1) {
  const response = await fetchApi(`/api/v1/admin/reservations?page=${page}`);
  return response.data || {};
}

async function updateReservationStatus(reservationId, status) {
  return fetchApi(`/api/v1/admin/reservations/${reservationId}/modify`, {
    method: "POST",
    body: JSON.stringify({ status }),
  });
}

function formatAdminReservationDate(checkIn, checkOut) {
  const start = checkIn ? new Date(checkIn).toLocaleDateString("ko-KR") : "";
  const end = checkOut ? new Date(checkOut).toLocaleDateString("ko-KR") : "";

  if (start && end) {
    return `${start} ~ ${end}`;
  }

  return start || end || "-";
}

function normalizeAdminReservation(reservation) {
  return {
    id: reservation.id,
    room_name: reservation.room_name || reservation.room_name || "",
    guestCount: reservation.guestCount ?? reservation.guest_count ?? 0,
    totalPrice: Number(reservation.totalPrice || reservation.total_price || 0),
    dateText: formatAdminReservationDate(
      reservation.checkIn || reservation.check_in,
      reservation.checkOut || reservation.check_out,
    ),
    guestName: reservation.guestName || reservation.guest_name || "",
    guestPhone:
      reservation.guestPhone ||
      reservation.guest_phone ||
      reservation.gusth_phone ||
      "-",
    status: reservation.status || "PENDING",
  };
}

function normalizeAdminRoom(room) {
  return {
    id: room.id ?? room.roomId ?? room.room_id,
    room_name: room.room_name || room.room_name || "",
    capacity: room.capacity ?? 0,
    price: Number(room.price || 0),
    picture: room.picture || room.image || "",
    description: room.description || "",
    policy: room.policy || room.rules || "",
    status: room.status || "",
    isActive:
      typeof room.isActive === "boolean"
        ? room.isActive
        : typeof room.is_active === "boolean"
          ? room.is_active
          : room.status === "ACTIVE",
  };
}
