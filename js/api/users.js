// This file will contain user-related API functions
// (e.g., signup, checkUsername, findId, findPw)

async function checkUsernameAvailability(username) {
    console.log(`Checking username: ${username}`);
    // DUMMY IMPLEMENTATION
    if (username === 'admin') {
        return Promise.resolve({ available: false });
    }
    return Promise.resolve({ available: true });
}

async function sendSmsVerification(phone) {
    console.log(`Sending SMS to: ${phone}`);
    // DUMMY IMPLEMENTATION
    return Promise.resolve({ success: true });
}

async function verifySmsCode(phone, code) {
    console.log(`Verifying code ${code} for ${phone}`);
    // DUMMY IMPLEMENTATION
    if (code === '123456') {
        return Promise.resolve({ success: true });
    }
    return Promise.resolve({ success: false });
}
