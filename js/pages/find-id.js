document.addEventListener('DOMContentLoaded', () => {
    const sendSmsBtn = document.getElementById('send-sms-btn');
    const smsVerifyGroup = document.getElementById('sms-verify-group');
    const verifySmsBtn = document.getElementById('verify-sms-btn');
    const foundIdResult = document.getElementById('found-id-result');
    const foundIdEl = document.getElementById('found-id');

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
            // In a real app, you'd get the ID from the server
            // const foundUsername = await findIdByPhone(phone);
            const foundUsername = 'guest'; // Dummy result
            foundIdEl.textContent = foundUsername; 
            foundIdResult.style.display = 'block';
            document.getElementById('find-id-form').style.display = 'none';
        } else {
            alert('인증번호가 일치하지 않습니다.');
        }
    });
});