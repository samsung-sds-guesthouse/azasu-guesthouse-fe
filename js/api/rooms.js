async function getRooms(searchParams = {}) {
    console.log('Fetching rooms with params:', searchParams);
    // DUMMY IMPLEMENTATION
    const allRooms = [
        { id: 1, name: 'Standard Room', max_guests: 2, price: 100000, image: 'https://via.placeholder.com/300x200.png?text=Room+1' },
        { id: 2, name: 'Deluxe Room', max_guests: 3, price: 150000, image: 'https://via.placeholder.com/300x200.png?text=Room+2' },
        { id: 3, name: 'Family Suite', max_guests: 5, price: 220000, image: 'https://via.placeholder.com/300x200.png?text=Room+3' },
        { id: 4, name: 'VIP Suite', max_guests: 2, price: 300000, image: 'https://via.placeholder.com/300x200.png?text=Room+4' },
    ];
    // In a real scenario, the backend would do the filtering. Here we simulate it.
    return Promise.resolve(allRooms);
}

async function getRoomDetail(roomId) {
    console.log(`Fetching details for room: ${roomId}`);
     // DUMMY IMPLEMENTATION
    const rooms = {
        1: { id: 1, name: 'Standard Room', max_guests: 2, price: 100000, description: 'A cozy room for two.', rules: 'No smoking.', image: 'https://via.placeholder.com/600x400.png?text=Standard+Room', unavailable_dates: ['2024-04-15', '2024-04-22', '2024-05-01'] },
        2: { id: 2, name: 'Deluxe Room', max_guests: 3, price: 150000, description: 'Spacious and luxurious.', rules: 'No pets allowed.', image: 'https://via.placeholder.com/600x400.png?text=Deluxe+Room', unavailable_dates: ['2024-04-18', '2024-04-25'] },
        3: { id: 3, name: 'Family Suite', max_guests: 5, price: 220000, description: 'Perfect for the whole family.', rules: 'Quiet hours after 10 PM.', image: 'https://via.placeholder.com/600x400.png?text=Family+Suite', unavailable_dates: ['2024-04-20', '2024-05-10'] },
        4: { id: 4, name: 'VIP Suite', max_guests: 2, price: 300000, description: 'The best we have to offer.', rules: 'Private events require pre-approval.', image: 'https://via.placeholder.com/600x400.png?text=VIP+Suite', unavailable_dates: [] },
    };
    const room = rooms[roomId];
    if (room) {
        return Promise.resolve(room);
    } else {
        return Promise.reject(new Error('Room not found'));
    }
}