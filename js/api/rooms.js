async function getRooms(searchParams = {}) {
    const query = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            query.append(key, value);
        }
    });

    const queryString = query.toString();
    const endpoint = queryString ? `/api/v1/rooms?${queryString}` : '/api/v1/rooms';
    const response = await fetchApi(endpoint);

    return response.data?.rooms || [];
}

async function getRoomDetail(roomId) {
    const response = await fetchApi(`/api/v1/rooms/${roomId}`);
    const rooms = response.data?.rooms;

    if (Array.isArray(rooms) && rooms.length > 0) {
        return rooms[0];
    }

    return response.data?.room || response.data || {};
}
