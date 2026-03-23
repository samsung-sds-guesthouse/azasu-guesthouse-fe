function encodeQuery(params) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

async function signupUser({ login_id, password, name, phone }) {
  return fetchApi("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      login_id,
      password,
      name,
      phone,
    }),
  });
}

async function checkUsernameAvailability(loginId) {
  try {
    const response = await fetchApi(
      `/api/v1/auth/duplicate-id${encodeQuery({ login_id: loginId })}`,
      {
        method: "GET",
      },
    );

    const msg =
      (response && response.msg) ||
      (response && response.data && response.data.msg) ||
      response ||
      "SUCCESS";

    return {
      available: msg === "SUCCESS",
      msg,
    };
  } catch (error) {
    if (error.message === "FAIL") {
      throw new Error("중복된 아이디입니다.");
    }

    throw error;
  }
}

async function sendSmsVerification(phone) {
  const response = await fetchApi("/api/v1/auth/sms", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });

  return {
    success: true,
    msg:
      (response && response.msg) ||
      (response && response.data && response.data.msg) ||
      response ||
      "SUCCESS",
  };
}

async function verifySmsCode(phone, code) {
  return Promise.resolve({
    success: /^\d{6}$/.test(code),
    phone,
  });
}
