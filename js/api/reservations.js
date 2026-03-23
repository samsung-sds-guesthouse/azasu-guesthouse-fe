async function getMyReservations() {
    console.log('Fetching my reservations');
    // DUMMY IMPLEMENTATION
    const reservations = [
        { id: 1, room_id: 2, room_name: 'Deluxe Room', guests: 2, price: 300000, date: '2024-05-10 ~ 2024-05-12', status: 'CONFIRMED', image: 'https://via.placeholder.com/150' },
        { id: 2, room_id: 1, room_name: 'Standard Room', guests: 1, price: 100000, date: '2024-04-28', status: 'PENDING', image: 'https://via.placeholder.com/150' },
        { id: 3, room_id: 3, room_name: 'Family Suite', guests: 4, price: 440000, date: '2024-03-15 ~ 2024-03-17', status: 'CANCELLED', image: 'https://via.placeholder.com/150' },
    ];
    return Promise.resolve(reservations);
}

async function cancelReservation(reservationId) {
    console.log(`Cancelling reservation ${reservationId}`);
    // DUMMY IMPLEMENTATION
    return Promise.resolve({ success: true });
}
