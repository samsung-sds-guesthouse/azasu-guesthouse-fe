document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginSubmitBtn = loginForm.querySelector('button[type="submit"]');

  const LOGIN_ID_MIN_LENGTH = 8;
  const LOGIN_ID_MAX_LENGTH = 15;
  const PASSWORD_MIN_LENGTH = 12;
  const PASSWORD_MAX_LENGTH = 20;

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

  function sanitizeRole(role) {
    return role === "ADMIN" ? "ADMIN" : "GUEST";
  }

  function getLoginErrorMessage(error) {
    const errorMessage = error && error.message ? error.message : "";
    const tryCount =
      error &&
      error.data &&
      error.data.data &&
      typeof error.data.data.try_count === "number"
        ? error.data.data.try_count
        : null;

    if (errorMessage === "Wrong Password") {
      if (tryCount !== null) {
        return `비밀번호가 올바르지 않습니다. 로그인 실패 ${tryCount}회입니다.`;
      }

      return "비밀번호가 올바르지 않습니다.";
    }

    if (errorMessage === "Login Unavailable") {
      return "로그인이 일시적으로 제한되었습니다. 30초 후 다시 시도해주세요.";
    }

    return "아이디 또는 비밀번호를 확인해주세요.";
  }

  function resolveRedirectUrl(role) {
    if (role === "ADMIN") {
      return "admin-dashboard.html";
    }

    const savedPath = sessionStorage.getItem("postLoginRedirectPath");
    if (savedPath) {
      sessionStorage.removeItem("postLoginRedirectPath");
      return savedPath;
    }

    const referrer = document.referrer ? new URL(document.referrer) : null;
    const isSameOriginReferrer =
      referrer && referrer.origin === window.location.origin;

    if (isSameOriginReferrer) {
      const referrerFileName =
        referrer.pathname.split("/").filter(Boolean).pop() || "index.html";
      const blockedPages = new Set([
        "login.html",
        "signup.html",
        "find-id.html",
        "find-pw.html",
      ]);

      if (!blockedPages.has(referrerFileName)) {
        return `${referrerFileName}${referrer.search}${referrer.hash}`;
      }
    }

    return "index.html";
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const loginId = getTrimmedValue(usernameInput);
    const password = passwordInput.value;

    if (!isValidLoginId(loginId)) {
      alert("아이디는 8자 이상 15자 이하로 입력해주세요.");
      return;
    }

    if (!isValidPassword(password)) {
      alert("비밀번호는 12자 이상 20자 이하로 입력해주세요.");
      return;
    }

    try {
      loginSubmitBtn.disabled = true;
      const response = await login(loginId, password);
      const message = response.msg || "SUCCESS";

      if (message !== "SUCCESS") {
        throw new Error(message);
      }

      const user = {
        id: escapeHTML(response.login_id || loginId),
        login_id: escapeHTML(response.login_id || loginId),
        name: escapeHTML(response.name || ""),
        role: sanitizeRole(response.role),
      };

      sessionStorage.removeItem("token");
      sessionStorage.setItem("user", JSON.stringify(user));
      window.location.href = resolveRedirectUrl(user.role);
    } catch (error) {
      alert(getLoginErrorMessage(error));
    } finally {
      loginSubmitBtn.disabled = false;
    }
  });
});
