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
  const rooms = await getRooms();
  const room = rooms.find((item) => String(item.id) === String(roomId));

  if (room) {
    return room;
  }

  throw new Error('객실 정보를 찾을 수 없습니다.');
}
