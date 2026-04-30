import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css";
import logo from "/favicon.svg";
import Button from "../../utilities/Button";

function SignUp() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      await register(form.email, form.password, form.name);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className={styles.signupContainer}>
      <form className="signupform" onSubmit={handleSubmit}>
        <h2>
          <img src={logo} alt="SafetyTrack " /> SafetyTrack
        </h2>
        <h3>Create Your Account</h3>
        <p className={styles.p1}>
          Join our community of responders and help <br /> make your
          neighborhood safer
        </p>
        <p>Full Name</p>
        <input
          type="text"
          className={styles.fullName}
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          autoFocus
        />
        <br />
        <input
          className={styles.emailDetail}
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />
        <div className={styles.passContainer}>
          <div className={styles.passDiv}>
            <p>Create Password</p>
            <input
              className="first-pass"
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.passDiv}>
            <p>Confirm Password</p>
            <input
              className="confirm-pass"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <p>
          Phone Number <span>(optional)</span>
        </p>
        <input type="text" className={styles.phone} />
        <p>Terms & Conditions</p>
        <div className={styles.terms}>
          <input type="checkbox" required /> I agree to the Terms of Service and
          Privacy Policy.
        </div>
        <div className={styles.buttonDiv}>
          <Button
            name={loading ? "Signing Up..." : "Sign Up"}
            classStyle={styles.signupButton}
            type="submit"
            disabled={loading}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <p>
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
      </form>
    </main>
  );
}

export default SignUp;
