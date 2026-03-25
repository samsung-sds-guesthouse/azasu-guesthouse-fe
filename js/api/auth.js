async function login(loginId, password) {
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
