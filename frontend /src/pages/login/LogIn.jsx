import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./LogIn.module.css";
import logo from "/favicon.svg";
import Button from "../../components/button/Button";
import ShowPassInput from "../../components/show_pass/ShowPasswordInput";

function LogIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
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

        <div className={styles.forgotPass}>
          <a href="">Forgot Password?</a>
        </div>
        <Button
          name={loading ? "Logging in..." : "Login"}
          classStyle={styles.loginButton}
          type="submit"
          disabled={loading}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className={styles.donthaveAC}>
          <p>
            Don't have an account?{" "}
            <Link to="/register" state={{ from: location.state?.from }}>
              Sign Up.
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}

export default LogIn;
