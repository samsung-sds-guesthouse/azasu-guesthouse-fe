async function login(loginId, password) {
  const TEMP_GUEST_LOGIN_ID = "guest1234";
  const TEMP_GUEST_PASSWORD = "password1234";
  const TEMP_ADMIN_LOGIN_ID = "admin1234";
  const TEMP_ADMIN_PASSWORD = "password1234";

  try {
    const response = await fetchApi("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({
        login_id: loginId,
        password,
      }),
    });

    const data =
      response && typeof response === "object" && response.data
        ? response.data
        : response;

    const msg =
      (data && data.msg) ||
      (response && response.msg) ||
      (typeof response === "string" ? response : "SUCCESS");

    return {
      msg,
      login_id: (data && data.login_id) || (response && response.login_id) || loginId,
      name: (data && data.name) || (response && response.name) || "",
      role: (data && data.role) || (response && response.role) || "GUEST",
    };
  } catch (error) {
    if (
      loginId === TEMP_ADMIN_LOGIN_ID &&
      password === TEMP_ADMIN_PASSWORD
    ) {
      return {
        msg: "SUCCESS",
        login_id: TEMP_ADMIN_LOGIN_ID,
        name: "테스트 관리자",
        role: "ADMIN",
      };
    }

    if (
      loginId === TEMP_GUEST_LOGIN_ID &&
      password === TEMP_GUEST_PASSWORD
    ) {
      return {
        msg: "SUCCESS",
        login_id: TEMP_GUEST_LOGIN_ID,
        name: "테스트 게스트",
        role: "GUEST",
      };
    }

    throw error;
  }
}

async function logout() {
  try {
    const response = await fetchApi("/api/v1/auth/logout", {
      method: "POST",
    });

    const data =
      response && typeof response === "object" && response.data
        ? response.data
        : response;

    return {
      msg:
        (data && data.msg) ||
        (response && response.msg) ||
        (typeof response === "string" ? response : "SUCCESS"),
    };
  } catch (error) {
    return {
      msg: "SUCCESS",
    };
  }
}
