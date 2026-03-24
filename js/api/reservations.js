function unwrapReservationResponse(response) {
    if (response && typeof response === 'object' && response.data) {
        return response.data;
    }

    return response;
}

function isTempGuestUser() {
    const user = JSON.parse(sessionStorage.getItem('user')) || {};
    return (
        user.login_id === 'guest1234' ||
        user.id === 'guest1234' ||
        user.name === '테스트 게스트'
    );
}

function createDummyReservationsPage(page) {
    const dummyReservations = [
        {
            id: 301,
            room_id: 2,
            room_name: '델타존',
            check_in: '2026-04-12T15:00:00',
            check_out: '2026-04-14T11:00:00',
            status: 'CONFIRMED',
            total_price: 240000,
            guest_count: 2,
            picture: 'https://via.placeholder.com/240x160?text=Delta',
            reservation_date: '2026-03-21T10:30:00',
        },
        {
            id: 302,
            room_id: 4,
            room_name: '하늘채',
            check_in: '2026-04-05T15:00:00',
            check_out: '2026-04-06T11:00:00',
            status: 'PENDING',
            total_price: 120000,
            guest_count: 3,
            picture: 'https://via.placeholder.com/240x160?text=Sky',
            reservation_date: '2026-03-20T18:10:00',
        },
        {
            id: 303,
            room_id: 1,
            room_name: '온유룸',
            check_in: '2026-03-18T15:00:00',
            check_out: '2026-03-19T11:00:00',
            status: 'CANCELLED',
            total_price: 98000,
            guest_count: 1,
            picture: 'https://via.placeholder.com/240x160?text=Onyu',
            reservation_date: '2026-03-10T09:00:00',
        },
    ];

    return {
        list: page === 1 ? dummyReservations : [],
        current_page: page,
        max_page: 1,
    };
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

        if (isTempGuestUser()) {
            return createDummyReservationsPage(page);
        }

        return {
            list: [],
            current_page: page,
            max_page: 1,
        };
    }
}

async function cancelReservation(reservationId) {
    try {
        const response = await fetchApi(`/api/v1/reservations/${reservationId}/delete`, {
            method: 'POST',
        });
        const msg = extractApiMessage(response, 'FAIL');

        if (msg !== 'SUCCESS') {
            throw new Error('예약 취소에 실패했습니다.');
        }

        return { msg };
    } catch (error) {
        if (isTempGuestUser()) {
            return { msg: 'SUCCESS' };
        }

        throw error;
    }
}
