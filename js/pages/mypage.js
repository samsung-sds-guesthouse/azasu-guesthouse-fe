document.addEventListener('DOMContentLoaded', async () => {
    checkUser(); // Redirect if not logged in

    const user = JSON.parse(sessionStorage.getItem('user'));

    // Populate user info
    document.getElementById('user-id').textContent = user.id; // In real app, this might be username
    document.getElementById('user-name').textContent = user.name;
    // document.getElementById('user-phone').textContent = user.phone; // Add phone to user object

    // Change password form
     document.getElementById('change-password-form').addEventListener('submit', (e) => {
        e.preventDefault();
        // In real app, call API to change password
        alert('비밀번호가 변경되었습니다.');
        e.target.reset();
    });

    // Delete account button
    document.getElementById('delete-account-btn').addEventListener('click', () => {
        const confirmation = confirm('예약 내역이 모두 삭제됩니다. 정말 탈퇴하겠습니까?');
        if (confirmation) {
            // In real app, call API to delete account
            alert('회원 탈퇴 처리되었습니다.');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token');
            window.location.href = '/';
        }
    });
});
