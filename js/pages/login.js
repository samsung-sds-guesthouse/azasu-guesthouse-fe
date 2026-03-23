document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Basic validation
    if (username.length < 8 || username.length > 15) {
        alert('아이디는 8~15자 사이여야 합니다.');
        return;
    }
    if (password.length < 12 || password.length > 20) {
        alert('비밀번호는 12~20자 사이여야 합니다.');
        return;
    }
    
    const response = await login(username, password);

    if (response.success) {
        sessionStorage.setItem('user', JSON.stringify(response.user));
        sessionStorage.setItem('token', response.token); // Store the token
        window.location.href = '/';
    } else {
        alert(response.message);
    }
});