//import users from "../mock_data/users.json" with { type: "json" };

// offline data testing
// export function loginRequest(email, password) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       const user = users.find((u) => u.email === email);
//       if (!user || user.password !== password) {
//         reject({ message: "Invalid email or password" });
//       } else {
//         const { password: _, ...safeUser } = user;
//         resolve({ user: safeUser });
//       }
//     }, 800);
//   });
// }

// export function changePasswordRequest(email, oldPassword, newPassword) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       const user = users.find((u) => u.email === email);

//       if (!user) {
//         reject({ message: "User not found" });
//       } else if (user.password !== oldPassword) {
//         reject({ message: "Current password is incorrect" });
//       } else {
//         user.password = newPassword; // mutates the imported array's object
//         resolve({ message: "Password changed successfully" });
//       }
//     }, 600);
//   });
// }

export async function changePasswordRequest(old_password, new_password) {
  try {
    const response = await fetch(
      "http://localhost:8000/auth/change-password/",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("userToken"),
        },
        body: JSON.stringify({ old_password, new_password }),
      },
    );
    const data = await response.json();
    return { serverResponse: data };
  } catch (error) {
    console.log("Change Password failed", error);
    throw error;
  }
}

export async function getCurrentUserRequest() {
  try {
    const response = await fetch("http://localhost:8000/auth/me/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("userToken"),
      },
    });
    const data = await response.json();
    return { serverResponse: data };
  } catch (error) {
    console.log("No user found", error);
    throw error;
  }
}

// export function getCurrentUserRequest(email) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       const user = users.find((u) => u.email === email);

//       if (!user) {
//         reject({ message: "Users not found" });
//       } else {
//         const { password: _, ...safeUser } = user;
//         resolve({ user: safeUser });
//       }
//     }, 400);
//   });
// }

//offline data testing
// export function registerRequest(email, password, name, number = "") {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (users.some((u) => u.email === email)) {
//         reject({ message: "User already exists" });
//       } else {
//         const newUser = {
//           id: Date.now().toString(),
//           email,
//           name,
//           password,
//           number,
//           role: "normal",
//         };
//         users.push(newUser); // mutates the array
//         const { password: _, ...safeUser } = newUser;
//         resolve({ user: safeUser });
//       }
//     }, 800);
//   });
// }

// real api data testing
// register user api call function
export async function registerRequest(email, password, name, number = "") {
  try {
    const response = await fetch("http://localhost:8000/auth/register/", {
      method: "POST",
      body: JSON.stringify({ email, password, name, number }),
    });
    const data = await response.json();
    return { serverResponse: data };
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}

export async function loginRequest(email, password) {
  try {
    const response = await fetch("http://localhost:8000/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    localStorage.setItem("userToken", data.token);
    return { serverResponse: data };
  } catch (error) {
    console.log("Login failed", error);
    throw error;
  }
}

// export async function loginRequest(email, password) {
//   const formData = new FormData();
//   formData.append("email", email);
//   formData.append("password", password);

//   try {
//     const response = await fetch("http://localhost:8000/auth/login/", {
//       method: "POST",
//       body: formData,
//     });
//     const data = await response.json();
//     return { serverResponse: data };
//   } catch (error) {
//     console.error("Login failed:", error);
//     throw error;
//   }
// }
