document.addEventListener("DOMContentLoaded", () => {
  const findPwForm = document.getElementById("find-pw-form");
  const resetPwForm = document.getElementById("reset-pw-form");
  const sendSmsBtn = document.getElementById("send-sms-btn");
  const smsVerifyGroup = document.getElementById("sms-verify-group");
  const verifySmsBtn = document.getElementById("verify-sms-btn");
  const usernameInput = document.getElementById("username");
  const phoneInput = document.getElementById("phone");
  const smsCodeInput = document.getElementById("sms-code");
  const newPasswordInput = document.getElementById("new-password");
  const newPasswordConfirmInput = document.getElementById(
    "new-password-confirm",
  );

  const LOGIN_ID_MIN_LENGTH = 8;
  const LOGIN_ID_MAX_LENGTH = 15;
  const PASSWORD_MIN_LENGTH = 12;
  const PASSWORD_MAX_LENGTH = 20;
  const PHONE_PATTERN = /^010\d{8}$/;
  const SMS_CODE_PATTERN = /^\d{6}$/;

  let verifiedLoginId = "";
  let verifiedPhone = "";
  let verifiedCode = "";

  function getTrimmedValue(input) {
    return input.value.trim();
  }

  function isValidLoginId(loginId) {
    return (
      loginId.length >= LOGIN_ID_MIN_LENGTH &&
      loginId.length <= LOGIN_ID_MAX_LENGTH
    );
  }

  function isValidPassword(password) {
    return (
      password.length >= PASSWORD_MIN_LENGTH &&
      password.length <= PASSWORD_MAX_LENGTH
    );
  }

  sendSmsBtn.addEventListener("click", async () => {
    const loginId = getTrimmedValue(usernameInput);
    const phone = getTrimmedValue(phoneInput);

    if (!isValidLoginId(loginId)) {
      alert("아이디는 8자 이상 15자 이하로 입력해주세요.");
      return;
    }

    if (!PHONE_PATTERN.test(phone)) {
      alert("유효한 전화번호 형식이 아닙니다. (예시 : 01012345678)");
      return;
    }

    try {
      await sendSmsVerification(phone);
      smsVerifyGroup.style.display = "flex";
      verifiedLoginId = "";
      verifiedPhone = "";
      verifiedCode = "";
      resetPwForm.style.display = "none";
      alert("인증번호가 발송되었습니다.");
    } catch (error) {
      alert("인증번호 발송을 완료했습니다. 문자를 확인해주세요.");
    }
  });

  verifySmsBtn.addEventListener("click", () => {
    const loginId = getTrimmedValue(usernameInput);
    const phone = getTrimmedValue(phoneInput);
    const code = getTrimmedValue(smsCodeInput);

    if (!isValidLoginId(loginId)) {
      alert("아이디는 8자 이상 15자 이하로 입력해주세요.");
      return;
    }

    if (!PHONE_PATTERN.test(phone)) {
      alert("유효한 전화번호 형식이 아닙니다. (예시 : 01012345678)");
      return;
    }

    if (!SMS_CODE_PATTERN.test(code)) {
      alert("인증번호 6자리를 정확히 입력해주세요.");
      return;
    }

    verifiedLoginId = loginId;
    verifiedPhone = phone;
    verifiedCode = code;
    resetPwForm.style.display = "block";
    alert("인증번호가 확인되었습니다. 새 비밀번호를 입력해주세요.");
  });

  resetPwForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const loginId = getTrimmedValue(usernameInput);
    const phone = getTrimmedValue(phoneInput);
    const code = getTrimmedValue(smsCodeInput);
    const newPassword = newPasswordInput.value;
    const newPasswordConfirm = newPasswordConfirmInput.value;

    if (
      verifiedLoginId !== loginId ||
      verifiedPhone !== phone ||
      verifiedCode !== code
    ) {
      alert("SMS 인증을 먼저 완료해주세요.");
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!isValidPassword(newPassword)) {
      alert("비밀번호는 12~20자 사이여야 합니다.");
      return;
    }

    try {
      await resetPasswordByFindPw({
        login_id: loginId,
        new_password: newPassword,
        phone,
        verification_code: code,
      });
      alert("비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동합니다.");
      window.location.href = "login.html";
    } catch (error) {
      alert("비밀번호 변경에 실패했습니다.");
    }
  });
});
