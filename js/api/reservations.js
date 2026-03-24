function unwrapReservationResponse(response) {
    if (response && typeof response === 'object' && response.data) {
        return response.data;
    }

    return response;
}

function toImageSrc(picture) {
    if (!picture) {
        return 'https://via.placeholder.com/240x160?text=Room';
    }

    if (
        picture.startsWith('data:') ||
        picture.startsWith('http://') ||
        picture.startsWith('https://') ||
        picture.startsWith('/')
    ) {
        return picture;
    }

    return `data:image/png;base64,${picture}`;
}

function normalizeReservation(item) {
    return {
        id: item.id,
        room_id: item.room_id,
        room_name: item.room_name || '객실명 없음',
        check_in: item.check_in || '',
        check_out: item.check_out || '',
        status: item.status || 'PENDING',
        total_price: Number(item.total_price || 0),
        guest_count: Number(item.guest_count || 0),
        picture: toImageSrc(item.picture),
        reservation_date: item.reservation_date || item.created_at || '',
    };
}

async function getMyReservations(page = 1) {
    try {
        const response = await fetchApi(`/api/v1/reservations/me?page=${page}`, {
            method: 'GET',
        });
        const data = unwrapReservationResponse(response);
        const msg = extractApiMessage(response, 'FAIL');

        if (msg !== 'SUCCESS') {
            return {
                list: [],
                current_page: page,
                max_page: 1,
            };
        }

        const reservationsData = data.reservations || {};
        const reservationList = Array.isArray(reservationsData.list)
            ? reservationsData.list
            : [];

        return {
            list: reservationList.map(normalizeReservation),
            current_page: Number(reservationsData.current_page || page),
            max_page: Number(reservationsData.max_page || 1),
        };
    } catch (error) {
        if (error.status === 401 || error.status === 403) {
            throw error;
        }

        return {
            list: [],
            current_page: page,
            max_page: 1,
        };
    }
}

async function cancelReservation(reservationId) {
    const response = await fetchApi(`/api/v1/reservations/${reservationId}/delete`, {
        method: 'POST',
    });
    const msg = extractApiMessage(response, 'FAIL');

    if (msg !== 'SUCCESS') {
        throw new Error('예약 취소에 실패했습니다.');
    }

    return { msg };
}
