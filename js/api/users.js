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

function unwrapResponse(response) {
  if (response && typeof response === "object" && response.data) {
    return response.data;
  }

  return response;
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

async function findIdByPhone(phone, verificationCode) {
  const response = await fetchApi(
    `/api/v1/auth/find-id${encodeQuery({
      phone,
      verification_code: verificationCode,
    })}`,
    {
      method: "GET",
    },
  );

  const data = unwrapResponse(response);
  const msg = extractApiMessage(response, "FAIL");

  if (msg !== "SUCCESS" || !data.login_id) {
    throw new Error("아이디를 찾지 못했습니다.");
  }

  return {
    msg,
    login_id: data.login_id,
  };
}

async function getMyInfo() {
  const response = await fetchApi("/api/v1/auth/my-info", {
    method: "GET",
  });

  const data = unwrapResponse(response);
  const msg = extractApiMessage(response, "FAIL");

  if (msg !== "SUCCESS") {
    throw new Error("회원 정보를 불러오지 못했습니다.");
  }

  return {
    msg,
    login_id: data.login_id || "",
    name: data.name || "",
    phone: data.phone || "",
  };
}

async function changePassword({ old_password, new_password }) {
  const response = await fetchApi("/api/v1/auth/change-pw", {
    method: "POST",
    body: JSON.stringify({
      old_password,
      new_password,
    }),
  });

  const msg = extractApiMessage(response, "FAIL");

  if (msg !== "SUCCESS") {
    throw new Error("비밀번호 변경에 실패했습니다.");
  }

  return { msg };
}

async function withdrawUser(password) {
  const response = await fetchApi("/api/v1/auth/withdraw", {
    method: "POST",
    body: JSON.stringify({ password }),
  });

  const msg = extractApiMessage(response, "FAIL");

  if (msg !== "SUCCESS") {
    throw new Error("회원 탈퇴에 실패했습니다.");
  }

  return { msg };
}
