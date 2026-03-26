async function getRooms(searchParams = {}) {
  const queryParams = new URLSearchParams();

  if (searchParams.check_in || searchParams.startDate) {
    queryParams.append(
      'check_in',
      searchParams.check_in || searchParams.startDate,
    );
  }

  if (searchParams.check_out || searchParams.endDate) {
    queryParams.append(
      'check_out',
      searchParams.check_out || searchParams.endDate,
    );
  }

  if (searchParams.guest_count || searchParams.guests) {
    queryParams.append(
      'guest_count',
      searchParams.guest_count || searchParams.guests,
    );
  }

  const queryString = queryParams.toString();
  const endpoint = queryString
    ? `/api/v1/rooms?${queryString}`
    : '/api/v1/rooms';

  return fetchApi(endpoint, {
    method: 'GET',
  });
}

async function getRoomDetail(roomId) {
  return fetchApi(`/api/v1/rooms/${roomId}`, {
    method: 'GET',
  });
}

async function getInactiveRoomDetail(roomId) {
  return fetchApi(`/api/v1/rooms/inactive/${roomId}`, {
    method: 'GET',
  });
}

async function createReservation({ room_id, check_in, check_out, guest_count }) {
  return fetchApi('/api/v1/reservations', {
    method: 'POST',
    body: JSON.stringify({
      room_id,
      check_in,
      check_out,
      guest_count,
    }),
  });
}
