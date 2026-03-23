document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");
  const checkUsernameBtn = document.getElementById("check-username-btn");
  const sendSmsBtn = document.getElementById("send-sms-btn");
  const smsVerifyGroup = document.getElementById("sms-verify-group");
  const signupBtn = document.getElementById("signup-btn");

  let isUsernameChecked = false;
  let isSmsVerified = false;

  function validateForm() {
    // Basic validation for demo
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    const isPasswordMatch = password && password === passwordConfirm;
    signupBtn.disabled = !(
      isUsernameChecked &&
      isSmsVerified &&
      isPasswordMatch
    );
  }

  checkUsernameBtn.addEventListener("click", () => {
    // Dummy check
    const username = document.getElementById("username").value;
    if (username.length >= 8) {
      // In a real app, call an API to check for uniqueness
      alert("사용 가능한 아이디입니다.");
      isUsernameChecked = true;
      validateForm();
    } else {
      alert("아이디는 8자 이상이어야 합니다.");
    }
  });

  sendSmsBtn.addEventListener("click", () => {
    const phone = document.getElementById("phone").value;
    if (/^010\d{8}$/.test(phone)) {
      smsVerifyGroup.style.display = "flex";
      alert("인증번호가 발송되었습니다. (테스트: 123456)");
      // In a real app: sendSmsVerification(phone);
    } else {
      alert("유효한 전화번호 형식이 아닙니다. (예시 : 01012345678)");
    }
  });

  document.getElementById("verify-sms-btn").addEventListener("click", () => {
    const code = document.getElementById("sms-code").value;
    if (code === "123456") {
      // Dummy code
      alert("인증되었습니다.");
      isSmsVerified = true;
      validateForm();
    } else {
      alert("인증번호가 일치하지 않습니다.");
    }
  });

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // In a real app, you would collect form data and send to the API
    alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
    window.location.href = "login.html";
  });

  // Add event listeners to re-validate on input
  ["username", "password", "password-confirm", "name", "phone"].forEach(
    (id) => {
      document.getElementById(id).addEventListener("input", validateForm);
    },
  );
});
