export async function changePasswordRequest(old_password, new_password) {
  const response = await fetch("/auth/change-password/", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ old_password, new_password }),
  });
  if (response.ok) {
    const data = await response.json();
    return { serverResponse: data };
  }
}

export async function getCurrentUserRequest() {
  const response = await fetch("/auth/me/", {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response.ok) {
    const data = await response.json();
    return { serverResponse: data };
  }
}

export async function registerRequest(email, password, name, number = "") {
  const response = await fetch("/auth/register/", {
    method: "POST",
    body: JSON.stringify({ email, password, name, number }),
    credentials: "include",
  });
  if (response.ok) {
    const data = await response.json();
    return { serverResponse: data };
  }
}

export async function loginRequest(email, password) {
  const response = await fetch("/auth/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  if (!response.ok) {
    const errorData = { error: "Invalid email or password" };
    return { serverResponse: errorData };
  }
  if (response.ok) {
    const data = await response.json();
    return { serverResponse: data };
  }
}

export async function logoutRequest() {
  await fetch("/auth/logout/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
}
