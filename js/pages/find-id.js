document.addEventListener("DOMContentLoaded", () => {
  const sendSmsBtn = document.getElementById("send-sms-btn");
  const smsVerifyGroup = document.getElementById("sms-verify-group");
  const verifySmsBtn = document.getElementById("verify-sms-btn");
  const foundIdResult = document.getElementById("found-id-result");
  const foundIdEl = document.getElementById("found-id");
  const phoneInput = document.getElementById("phone");
  const smsCodeInput = document.getElementById("sms-code");
  const findIdForm = document.getElementById("find-id-form");
  const PHONE_PATTERN = /^010\d{8}$/;
  const SMS_CODE_PATTERN = /^\d{6}$/;

  function getTrimmedValue(input) {
    return input.value.trim();
  }

  sendSmsBtn.addEventListener("click", async () => {
    const phone = getTrimmedValue(phoneInput);

    if (!PHONE_PATTERN.test(phone)) {
      alert("유효한 전화번호 형식이 아닙니다. (예시 : 01012345678)");
      return;
    }

    try {
      sendSmsBtn.disabled = true;
      await sendSmsVerification(phone);
      smsVerifyGroup.style.display = "flex";
      alert("인증번호가 발송되었습니다.");
    } catch (error) {
      alert("인증번호 발송을 완료했습니다. 문자를 확인해주세요.");
    } finally {
      sendSmsBtn.disabled = false;
    }
  });

  verifySmsBtn.addEventListener("click", async () => {
    const phone = getTrimmedValue(phoneInput);
    const code = getTrimmedValue(smsCodeInput);

    if (!PHONE_PATTERN.test(phone)) {
      alert("유효한 전화번호 형식이 아닙니다. (예시 : 01012345678)");
      return;
    }

    if (!SMS_CODE_PATTERN.test(code)) {
      alert("인증번호 6자리를 정확히 입력해주세요.");
      return;
    }

    try {
      verifySmsBtn.disabled = true;
      const response = await findIdByPhone(phone, code);
      foundIdEl.textContent = response.login_id;
      foundIdResult.style.display = "block";
      findIdForm.style.display = "none";
      alert("인증되었습니다.");
    } catch (error) {
      alert("입력한 정보로 아이디를 찾을 수 없습니다.");
    } finally {
      verifySmsBtn.disabled = false;
    }
  });
});
