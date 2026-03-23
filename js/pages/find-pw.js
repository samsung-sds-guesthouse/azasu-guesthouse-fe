document.addEventListener('DOMContentLoaded', () => {
    const findPwForm = document.getElementById('find-pw-form');
    const resetPwForm = document.getElementById('reset-pw-form');
    const sendSmsBtn = document.getElementById('send-sms-btn');
    const smsVerifyGroup = document.getElementById('sms-verify-group');
    const verifySmsBtn = document.getElementById('verify-sms-btn');

    sendSmsBtn.addEventListener('click', () => {
        const phone = document.getElementById('phone').value;
        if (/^010-\d{4}-\d{4}$/.test(phone)) {
             smsVerifyGroup.style.display = 'flex';
             alert('인증번호가 발송되었습니다. (테스트: 123456)');
             // In a real app: sendSmsVerification(phone);
        } else {
            alert('유효한 전화번호 형식이 아닙니다. (010-XXXX-XXXX)');
        }
    });

    verifySmsBtn.addEventListener('click', () => {
        const code = document.getElementById('sms-code').value;
         if (code === '123456') { // Dummy code
            alert('인증되었습니다.');
            findPwForm.style.display = 'none';
            resetPwForm.style.display = 'block';
        } else {
            alert('인증번호가 일치하지 않습니다.');
        }
    });

    resetPwForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('new-password').value;
        const newPasswordConfirm = document.getElementById('new-password-confirm').value;

        if (newPassword !== newPasswordConfirm) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        if (newPassword.length < 12 || newPassword.length > 20) {
            alert('비밀번호는 12~20자 사이여야 합니다.');
            return;
        }
        
        // In a real app: await resetPassword(username, newPassword);
        alert('비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동합니다.');
        window.location.href = 'login.html';
    });
});