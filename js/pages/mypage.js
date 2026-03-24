document.addEventListener('DOMContentLoaded', async () => {
    checkUser(); // Redirect if not logged in

    const TEMP_GUEST_LOGIN_ID = 'guest1234';
    const userIdElement = document.getElementById('user-id');
    const userNameElement = document.getElementById('user-name');
    const userPhoneElement = document.getElementById('user-phone');
    const changePasswordForm = document.getElementById('change-password-form');
    const withdrawForm = document.getElementById('withdraw-form');
    const changePasswordBtn = changePasswordForm.querySelector('button[type="submit"]');
    const withdrawBtn = withdrawForm.querySelector('button[type="submit"]');
    const sessionUser = JSON.parse(sessionStorage.getItem('user')) || {};

    try {
        const myInfo = await getMyInfo();

        userIdElement.textContent = myInfo.login_id;
        userNameElement.textContent = myInfo.name;
        userPhoneElement.textContent = myInfo.phone;

        sessionStorage.setItem('user', JSON.stringify({
            ...sessionUser,
            id: myInfo.login_id,
            login_id: myInfo.login_id,
            name: myInfo.name,
            phone: myInfo.phone,
        }));
    } catch (error) {
        const isTempGuestUser =
            sessionUser.login_id === TEMP_GUEST_LOGIN_ID ||
            sessionUser.id === TEMP_GUEST_LOGIN_ID ||
            sessionUser.name === '테스트 게스트';

        if (error.status === 404 && isTempGuestUser) {
            userIdElement.textContent = TEMP_GUEST_LOGIN_ID;
            userNameElement.textContent = sessionUser.name || '테스트 게스트';
            userPhoneElement.textContent = sessionUser.phone || '-';

            sessionStorage.setItem('user', JSON.stringify({
                ...sessionUser,
                id: TEMP_GUEST_LOGIN_ID,
                login_id: TEMP_GUEST_LOGIN_ID,
                name: sessionUser.name || '테스트 게스트',
                phone: sessionUser.phone || '',
            }));
            return;
        }

        alert('회원 정보를 불러오지 못했습니다.');
        window.location.href = 'login.html';
        return;
    }

    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const currentPassword = document.getElementById('current-password').value.trim();
        const newPassword = document.getElementById('new-password').value.trim();
        const newPasswordConfirm = document.getElementById('new-password-confirm').value.trim();

        if (newPassword !== newPasswordConfirm) {
            alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }

        try {
            changePasswordBtn.disabled = true;
            await changePassword({
                old_password: currentPassword,
                new_password: newPassword,
            });

            alert('비밀번호가 변경되었습니다.');
            e.target.reset();
        } catch (error) {
            alert('비밀번호 변경에 실패했습니다.');
        } finally {
            changePasswordBtn.disabled = false;
        }
    });

    withdrawForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const password = document.getElementById('withdraw-password').value.trim();
        const confirmation = confirm('예약 내역이 모두 삭제됩니다. 정말 탈퇴하시겠습니까?');

        if (!confirmation) {
            return;
        }

        try {
            withdrawBtn.disabled = true;
            await withdrawUser(password);
            alert('회원 탈퇴 처리되었습니다.');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token');
            window.location.href = '/';
        } catch (error) {
            alert('회원 탈퇴에 실패했습니다.');
        } finally {
            withdrawBtn.disabled = false;
        }
    });
});
