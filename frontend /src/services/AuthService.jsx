import users from "../mock_data/user.json" with { type: "json" };

export function loginRequest(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find((u) => u.email === email);
      if (!user || user.password !== password) {
        reject({ message: "Invalid email or password" });
      } else {
        const { password: _, ...safeUser } = user;
        resolve({ user: safeUser });
      }
    }, 800);
  });
}

export function changePasswordRequest(email, oldPassword, newPassword) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find((u) => u.email === email);

      if (!user) {
        reject({ message: "User not found" });
      } else if (user.password !== oldPassword) {
        reject({ message: "Current password is incorrect" });
      } else {
        user.password = newPassword; // mutates the imported array's object
        resolve({ message: "Password changed successfully" });
      }
    }, 600);
  });
}

export function getCurrentUserRequest(email) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find((u) => u.email === email);
      console.log(user);
      if (!user) {
        reject({ message: "User not found" });
      } else {
        const { password: _, ...safeUser } = user;
        resolve({ user: safeUser });
      }
    }, 400);
  });
}

export function registerRequest(email, password, name, number = "") {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (users.some((u) => u.email === email)) {
        reject({ message: "User already exists" });
      } else {
        const newUser = {
          id: Date.now().toString(),
          email,
          name,
          password,
          number,
        };
        users.push(newUser); // mutates the array
        const { password: _, ...safeUser } = newUser;
        resolve({ user: safeUser });
      }
    }, 800);
  });
}
