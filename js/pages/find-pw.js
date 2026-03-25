document.addEventListener("DOMContentLoaded", () => {
  const sendSmsBtn = document.getElementById("send-sms-btn");
  const verifySmsBtn = document.getElementById("verify-sms-btn");
  const changePasswordBtn = document.querySelector(
    '#reset-pw-form button[type="submit"]',
  );

  sendSmsBtn.addEventListener("click", () => {
    alert("비밀번호 찾기 기능은 아직 API 개발 중입니다.");
  });

  verifySmsBtn.addEventListener("click", () => {
    alert("비밀번호 찾기 기능은 아직 API 개발 중입니다.");
  });

  changePasswordBtn.addEventListener("click", (e) => {
    e.preventDefault();
    alert("비밀번호 찾기 기능은 아직 API 개발 중입니다.");
  });
});
