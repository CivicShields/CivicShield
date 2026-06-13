import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./LogIn.module.css";
import logo from "/imagelogo.png";
import Button from "../../components/button/Button";
import ShowPassInput from "../../components/show_pass/ShowPasswordInput";
import Notify from "../../components/notify/Notify";

function LogIn() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const previousPage = location.state?.from?.pathname || "/dashboard";

  // Check if the previous page is one we shouldn't go back to
  const blacklistedPaths = [
    "/settings",
    "/settings/notifications",
    "/settings/security",
    "/settings/myreports",
    "/settings/profile",
  ];
  const from = blacklistedPaths.includes(previousPage)
    ? "/dashboard"
    : previousPage;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const req = await fetch("/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
        credentials: "include",
      });
      if (!req.ok) {
        const errorData = { error: "Invalid email or password" };
        return setError(errorData);
      }
      const res = await req.json();
      if (res.error) {
        setLoading(false);
        return setError(res.error);
      }
      setUser(res.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.loginContainer}>
      <form action="" onSubmit={handleSubmit}>
        <h2>
          <img src={logo} alt="" /> SafetyTrack
        </h2>
        <h3>Welcome Back!</h3>
        <p className={styles.p1}>Log in to access your reporter dashboard.</p>
        {error && <Notify key={error} type="error" content={error} />}
        <p>Email Address</p>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          type="email"
          className={styles.emailAddress}
          required
          autoFocus
        />
        <p>Password</p>
        <div className={styles.passContainer}>
          <div className={styles.passDiv}>
            <ShowPassInput
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => {
                const val = e.target.value;
                setForm({ ...form, password: val });
              }}
            />
          </div>
        </div>
        <Button
          name={loading ? "Logging in..." : "Login"}
          classStyle={styles.loginButton}
          type="submit"
          disabled={loading}
        />
        <div className={styles.donthaveAC}>
          <p>
            Don't have an account?{" "}
            <Link to="/register" state={{ from: location.state?.from }}>
              Sign Up.
            </Link>
          </p>
          <p>
            <Link to="/">Back to landing page</Link>
          </p>
        </div>
      </form>
    </main>
  );
}

export default LogIn;
