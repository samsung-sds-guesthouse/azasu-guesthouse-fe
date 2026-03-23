async function login(username, password) {
    console.log(`Attempting to log in with username: ${username}`);
    // DUMMY IMPLEMENTATION
    if (username === 'admin' && password === 'password1234') {
        return Promise.resolve({
            success: true,
            user: {
                id: 1,
                name: 'Admin User',
                role: 'ADMIN',
            },
            token: 'dummy-admin-token'
        });
    } else if (username === 'guest' && password === 'password1234') {
        return Promise.resolve({
            success: true,
            user: {
                id: 2,
                name: 'Guest User',
                role: 'GUEST',
            },
             token: 'dummy-guest-token'
        });
    } else {
        return Promise.resolve({ success: false, message: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    // REAL IMPLEMENTATION (EXAMPLE)
    /*
    return fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
    */
}