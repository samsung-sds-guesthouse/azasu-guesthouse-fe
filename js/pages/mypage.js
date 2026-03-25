document.addEventListener('DOMContentLoaded', async () => {
    checkUser(); // Redirect if not logged in

    const userIdElement = document.getElementById('user-id');
    const userNameElement = document.getElementById('user-name');
    const userPhoneElement = document.getElementById('user-phone');
    const changePasswordForm = document.getElementById('change-password-form');
    const withdrawForm = document.getElementById('withdraw-form');
    const changePasswordBtn = changePasswordForm.querySelector('button[type="submit"]');
    const withdrawBtn = withdrawForm.querySelector('button[type="submit"]');
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const newPasswordConfirmInput = document.getElementById('new-password-confirm');
    const withdrawPasswordInput = document.getElementById('withdraw-password');
    const currentPasswordMessage = document.getElementById('current-password-message');
    const newPasswordMessage = document.getElementById('new-password-message');
    const newPasswordConfirmMessage = document.getElementById('new-password-confirm-message');
    const withdrawPasswordMessage = document.getElementById('withdraw-password-message');
    const sessionUser = JSON.parse(sessionStorage.getItem('user')) || {};
    const PASSWORD_MIN_LENGTH = 12;
    const PASSWORD_MAX_LENGTH = 20;

    function setFieldMessage(element, message, type = 'error') {
        element.textContent = message;
        element.hidden = !message;
        element.classList.toggle('is-success', type === 'success');
        element.classList.toggle('is-muted', type === 'muted');
    }

    function setFieldValidity(input, isValid) {
        if (isValid) {
            input.removeAttribute('aria-invalid');
            return;
        }

        input.setAttribute('aria-invalid', 'true');
    }

    function isValidPassword(password) {
        return (
            password.length >= PASSWORD_MIN_LENGTH &&
            password.length <= PASSWORD_MAX_LENGTH
        );
    }

    function validateChangePasswordForm() {
        const currentPassword = currentPasswordInput.value.trim();
        const newPassword = newPasswordInput.value.trim();
        const newPasswordConfirm = newPasswordConfirmInput.value.trim();
        const isNewPasswordValid = isValidPassword(newPassword);
        const isPasswordMatch =
            newPasswordConfirm.length > 0 && newPassword === newPasswordConfirm;

        setFieldValidity(currentPasswordInput, currentPassword.length > 0);
        setFieldValidity(
            newPasswordInput,
            newPassword.length === 0 || isNewPasswordValid,
        );
        setFieldValidity(
            newPasswordConfirmInput,
            newPasswordConfirm.length === 0 || isPasswordMatch,
        );

        setFieldMessage(currentPasswordMessage, currentPassword ? '' : '');

        if (!newPassword) {
            setFieldMessage(
                newPasswordMessage,
                '비밀번호는 12자 이상 20자 이하로 입력해주세요.',
                'muted',
            );
        } else if (!isNewPasswordValid) {
            setFieldMessage(
                newPasswordMessage,
                '비밀번호는 12자 이상 20자 이하로 입력해주세요.',
            );
        } else {
            setFieldMessage(
                newPasswordMessage,
                '사용 가능한 비밀번호 길이입니다.',
                'success',
            );
        }

        if (!newPasswordConfirm) {
            setFieldMessage(newPasswordConfirmMessage, '');
        } else if (!isPasswordMatch) {
            setFieldMessage(
                newPasswordConfirmMessage,
                '새 비밀번호와 비밀번호 확인이 일치하지 않습니다.',
            );
        } else {
            setFieldMessage(
                newPasswordConfirmMessage,
                '비밀번호 확인이 일치합니다.',
                'success',
            );
        }

    }

    function validateWithdrawForm() {
        const password = withdrawPasswordInput.value.trim();
        const hasPassword = password.length > 0;

        setFieldValidity(withdrawPasswordInput, hasPassword || password.length === 0);

        if (!hasPassword) {
            setFieldMessage(withdrawPasswordMessage, '');
            return;
        }

        setFieldMessage(
            withdrawPasswordMessage,
            '입력 후 탈퇴를 진행하면 복구되지 않을 수 있습니다.',
            'muted',
        );
    }

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
        alert('회원 정보를 불러오지 못했습니다.');
        return;
    }

    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const currentPassword = currentPasswordInput.value.trim();
        const newPassword = newPasswordInput.value.trim();
        const newPasswordConfirm = newPasswordConfirmInput.value.trim();

        validateChangePasswordForm();

        if (!currentPassword) {
            alert('현재 비밀번호를 입력해주세요.');
            return;
        }

        if (!isValidPassword(newPassword)) {
            alert('새 비밀번호는 12자 이상 20자 이하로 입력해주세요.');
            return;
        }

        if (currentPassword === newPassword) {
            alert('현재 비밀번호와 새 비밀번호는 다르게 입력해주세요.');
            return;
        }

        if (newPassword !== newPasswordConfirm) {
            alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }

        const confirmation = confirm('비밀번호를 변경하시겠습니까?');

        if (!confirmation) {
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
            validateChangePasswordForm();
        } catch (error) {
            alert('비밀번호 변경에 실패했습니다.');
        } finally {
            changePasswordBtn.disabled = false;
        }
    });

    withdrawForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const password = withdrawPasswordInput.value.trim();
        validateWithdrawForm();

        if (!password) {
            alert('비밀번호를 입력해주세요.');
            return;
        }

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

    [currentPasswordInput, newPasswordInput, newPasswordConfirmInput].forEach((input) => {
        input.addEventListener('input', validateChangePasswordForm);
    });

    withdrawPasswordInput.addEventListener('input', validateWithdrawForm);

    validateChangePasswordForm();
    validateWithdrawForm();
});
