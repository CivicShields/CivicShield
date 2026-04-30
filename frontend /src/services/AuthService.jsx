// services/authService.js
const fakeUserDB = {
  "test@test.com": {
    id: "123",
    email: "test@test.com",
    name: "Test User",
    password: "password123",
  },
};

export function loginRequest(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = fakeUserDB[email];
      if (!user || user.password !== password) {
        reject({ message: "Invalid email or password" });
      } else {
        // Return user without password
        const { password: _, ...safeUser } = user;
        resolve({ user: safeUser });
      }
    }, 800); // simulate network delay
  });
}

export function changePasswordRequest(email, oldPassword, newPassword) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = fakeUserDB[email];

      if (!user) {
        reject({ message: "User not found" });
      } else if (user.password !== oldPassword) {
        reject({ message: "Current password is incorrect" });
      } else {
        // Update password
        user.password = newPassword;
        resolve({ message: "Password changed successfully" });
      }
    }, 600);
  });
}

export function getCurrentUserRequest(email) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = fakeUserDB[email];
      if (!user) {
        reject({ message: "User not found" });
      } else {
        const { password: _, ...safeUser } = user;
        resolve({ user: safeUser });
      }
    }, 400);
  });
}

export function registerRequest(email, password, name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fakeUserDB[email]) {
        reject({ message: "User already exists" });
      } else {
        const newUser = { id: Date.now().toString(), email, name, password };
        fakeUserDB[email] = newUser;
        const { password: _, ...safeUser } = newUser;
        resolve({ user: safeUser });
      }
    }, 800);
  });
}
