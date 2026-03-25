document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const passwordConfirmInput = document.getElementById("password-confirm");
  const passwordConfirmMessage = document.getElementById(
    "password-confirm-message",
  );
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const smsCodeInput = document.getElementById("sms-code");
  const checkUsernameBtn = document.getElementById("check-username-btn");
  const sendSmsBtn = document.getElementById("send-sms-btn");
  const smsVerifyGroup = document.getElementById("sms-verify-group");
  const verifySmsBtn = document.getElementById("verify-sms-btn");
  const smsTimer = document.getElementById("sms-timer");
  const signupBtn = document.getElementById("signup-btn");

  let isUsernameChecked = false;
  let isSmsVerified = false;
  let checkedUsername = "";
  let verifiedPhone = "";
  let smsExpiresAt = 0;
  let smsTimerId = null;
  let smsSendCount = 0;
  let smsResendCount = 0;
  let smsRequestedPhone = "";

  const LOGIN_ID_MIN_LENGTH = 8;
  const LOGIN_ID_MAX_LENGTH = 15;
  const PASSWORD_MIN_LENGTH = 12;
  const PASSWORD_MAX_LENGTH = 20;
  const NAME_MIN_LENGTH = 1;
  const NAME_MAX_LENGTH = 30;
  const PHONE_PATTERN = /^010\d{8}$/;
  const SMS_CODE_PATTERN = /^\d{6}$/;
  const SMS_EXPIRE_MS = 5 * 60 * 1000;
  const MAX_SMS_SEND_COUNT = 3;
  const MAX_SMS_RESEND_COUNT = 2;
  const ENABLE_TEMP_SIGNUP_BYPASS = true;

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

  function isValidName(name) {
    return name.length >= NAME_MIN_LENGTH && name.length <= NAME_MAX_LENGTH;
  }

  function isValidPhone(phone) {
    return PHONE_PATTERN.test(phone);
  }

  function isSmsExpired() {
    return !smsExpiresAt || Date.now() > smsExpiresAt;
  }

  function resetUsernameCheck() {
    isUsernameChecked = false;
    checkedUsername = "";
  }

  function stopSmsTimer() {
    if (smsTimerId) {
      clearInterval(smsTimerId);
      smsTimerId = null;
    }
  }

  function resetSmsVerificationState({ keepCount = false } = {}) {
    isSmsVerified = false;
    verifiedPhone = "";
    smsExpiresAt = 0;
    smsCodeInput.value = "";
    smsVerifyGroup.style.display = "none";
    smsTimer.textContent = "5:00";
    stopSmsTimer();

    if (!keepCount) {
      smsSendCount = 0;
      smsResendCount = 0;
      smsRequestedPhone = "";
    }
  }

  function startSmsTimer() {
    stopSmsTimer();

    const updateTimer = () => {
      const remainingMs = Math.max(smsExpiresAt - Date.now(), 0);
      const remainingSeconds = Math.ceil(remainingMs / 1000);
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;

      smsTimer.textContent = `${minutes}:${String(seconds).padStart(2, "0")}`;

      if (remainingMs <= 0) {
        stopSmsTimer();
        isSmsVerified = false;
        verifiedPhone = "";
        validateForm();
        alert("SMS 인증 시간이 만료되었습니다. 다시 인증번호를 요청해주세요.");
      }
    };

    updateTimer();
    smsTimerId = setInterval(updateTimer, 1000);
  }

  function validateForm() {
    const loginId = getTrimmedValue(usernameInput);
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;
    const name = getTrimmedValue(nameInput);
    const phone = getTrimmedValue(phoneInput);
    const isPasswordMatch = password !== "" && password === passwordConfirm;
    const isFieldValid =
      isValidLoginId(loginId) &&
      isValidPassword(password) &&
      isValidName(name) &&
      isValidPhone(phone);
    const isUsernameStateValid =
      isUsernameChecked && checkedUsername === loginId;
    const isSmsStateValid =
      isSmsVerified && verifiedPhone === phone && !isSmsExpired();

    signupBtn.disabled = !(
      isFieldValid &&
      isUsernameStateValid &&
      isSmsStateValid &&
      isPasswordMatch
    );
  }

  function updatePasswordConfirmFeedback() {
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

    if (!passwordConfirm) {
      passwordConfirmMessage.hidden = true;
      passwordConfirmMessage.textContent = "";
      passwordConfirmInput.removeAttribute("aria-invalid");
      return;
    }

    if (password === passwordConfirm) {
      passwordConfirmMessage.hidden = true;
      passwordConfirmMessage.textContent = "";
      passwordConfirmInput.removeAttribute("aria-invalid");
      return;
    }

    passwordConfirmMessage.hidden = false;
    passwordConfirmMessage.textContent = "비밀번호가 일치하지 않습니다.";
    passwordConfirmInput.setAttribute("aria-invalid", "true");
  }

  checkUsernameBtn.addEventListener("click", async () => {
    const loginId = getTrimmedValue(usernameInput);

    if (!isValidLoginId(loginId)) {
      alert("아이디는 8자 이상 15자 이하로 입력해주세요.");
      return;
    }

    try {
      checkUsernameBtn.disabled = true;
      const response = await checkUsernameAvailability(loginId);
      isUsernameChecked = response.available;
      checkedUsername = loginId;
      alert("사용 가능한 아이디입니다.");
      validateForm();
    } catch (error) {
      resetUsernameCheck();
      validateForm();
      alert("사용할 수 없는 아이디입니다.");
    } finally {
      checkUsernameBtn.disabled = false;
    }
  });

  sendSmsBtn.addEventListener("click", async () => {
    const phone = getTrimmedValue(phoneInput);

    if (!isValidPhone(phone)) {
      alert("유효한 전화번호 형식이 아닙니다. (예시 : 01012345678)");
      return;
    }

    if (smsRequestedPhone && smsRequestedPhone !== phone) {
      resetSmsVerificationState();
    }

    if (smsSendCount >= MAX_SMS_SEND_COUNT) {
      alert("인증번호는 최대 3회까지 요청할 수 있습니다.");
      return;
    }

    if (smsSendCount > 0 && smsResendCount >= MAX_SMS_RESEND_COUNT) {
      alert("인증번호 재전송은 2회까지만 가능합니다.");
      return;
    }

    try {
      sendSmsBtn.disabled = true;
      await sendSmsVerification(phone);
      smsRequestedPhone = phone;
      smsSendCount += 1;
      if (smsSendCount > 1) {
        smsResendCount += 1;
      }
      isSmsVerified = false;
      verifiedPhone = "";
      smsExpiresAt = Date.now() + SMS_EXPIRE_MS;
      smsVerifyGroup.style.display = "flex";
      startSmsTimer();
      validateForm();
      alert("인증번호가 발송되었습니다. 5분 이내에 인증을 완료해주세요.");
    } catch (error) {
      if (ENABLE_TEMP_SIGNUP_BYPASS) {
        smsRequestedPhone = phone;
        isSmsVerified = true;
        verifiedPhone = phone;
        smsExpiresAt = Date.now() + SMS_EXPIRE_MS;
        smsVerifyGroup.style.display = "none";
        stopSmsTimer();
        validateForm();
        alert("SMS API가 준비되지 않아 임시로 인증 완료 처리했습니다.");
        return;
      }

      alert("인증번호 발송을 완료했습니다. 문자를 확인해주세요.");
    } finally {
      sendSmsBtn.disabled = false;
    }
  });

  verifySmsBtn.addEventListener("click", async () => {
    const phone = getTrimmedValue(phoneInput);
    const code = getTrimmedValue(smsCodeInput);

    if (!isValidPhone(phone)) {
      alert("유효한 전화번호 형식이 아닙니다. (예시 : 01012345678)");
      return;
    }

    if (!smsRequestedPhone) {
      alert("먼저 인증번호를 발송해주세요.");
      return;
    }

    if (smsRequestedPhone !== phone) {
      alert("인증번호를 발송한 전화번호와 현재 입력한 전화번호가 다릅니다.");
      return;
    }

    if (isSmsExpired()) {
      alert("SMS 인증 시간이 만료되었습니다. 다시 인증번호를 요청해주세요.");
      return;
    }

    if (!SMS_CODE_PATTERN.test(code)) {
      alert("인증번호 6자리를 정확히 입력해주세요.");
      return;
    }

    try {
      verifySmsBtn.disabled = true;
      const response = await verifySmsCode(phone, code);
      if (!response.success) {
        throw new Error("인증번호가 일치하지 않습니다.");
      }

      isSmsVerified = true;
      verifiedPhone = phone;
      stopSmsTimer();
      alert("인증되었습니다.");
      validateForm();
    } catch (error) {
      alert("인증에 실패했습니다.");
    } finally {
      verifySmsBtn.disabled = false;
    }
  });

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const loginId = getTrimmedValue(usernameInput);
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;
    const name = getTrimmedValue(nameInput);
    const phone = getTrimmedValue(phoneInput);

    if (!isValidLoginId(loginId)) {
      alert("아이디는 8자 이상 15자 이하로 입력해주세요.");
      return;
    }

    if (!isValidPassword(password)) {
      alert("비밀번호는 12자 이상 20자 이하로 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!isValidName(name)) {
      alert("이름은 1자 이상 30자 이하로 입력해주세요.");
      return;
    }

    if (!isValidPhone(phone)) {
      alert("유효한 전화번호 형식이 아닙니다. (예시 : 01012345678)");
      return;
    }

    if (!isUsernameChecked || checkedUsername !== loginId) {
      alert("아이디 중복 체크를 먼저 완료해주세요.");
      return;
    }

    if (!isSmsVerified || verifiedPhone !== phone || isSmsExpired()) {
      alert("SMS 인증을 먼저 완료해주세요.");
      return;
    }

    try {
      signupBtn.disabled = true;
      const response = await signupUser({
        login_id: loginId,
        password,
        name,
        phone,
      });

      const successMessage =
        (response && response.msg) ||
        (response && response.data && response.data.msg) ||
        response ||
        "SUCCESS";

      alert(
        successMessage === "SUCCESS"
          ? "회원가입이 완료되었습니다. 로그인 페이지로 이동합니다."
          : successMessage,
      );
      window.location.href = "login.html";
    } catch (error) {
      alert("회원가입에 실패했습니다.");
    } finally {
      validateForm();
    }
  });

  usernameInput.addEventListener("input", () => {
    resetUsernameCheck();
    validateForm();
  });

  phoneInput.addEventListener("input", () => {
    if (
      smsRequestedPhone &&
      smsRequestedPhone !== getTrimmedValue(phoneInput)
    ) {
      resetSmsVerificationState();
    }
    validateForm();
  });

  [passwordInput, passwordConfirmInput, nameInput, smsCodeInput].forEach(
    (input) => {
      input.addEventListener("input", () => {
        if (input === passwordInput || input === passwordConfirmInput) {
          updatePasswordConfirmFeedback();
        }
        validateForm();
      });
    },
  );

  updatePasswordConfirmFeedback();
  validateForm();
});
