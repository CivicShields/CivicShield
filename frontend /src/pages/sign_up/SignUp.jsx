import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { CheckCircle2Icon } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./SignUp.module.css";
import logo from "/imagelogo.png";
import Button from "../../components/button/Button";
import ShowPassInput from "../../components/show_pass/ShowPasswordInput";
import Notify from "../../components/notify/Notify";

function SignUp() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState({
    character: false,
    number: false,
    special: false,
  });

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

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (check.character !== true) {
      return setError("Password doesnt meet should be at least 8 characters");
    }
    if (check.special !== true) {
      return setError(
        "Password doesnt meet should contain at least one special characters i.e.!@#%$*",
      );
    } else if (check.number !== true) {
      return setError(
        "Password doesnt meet should be contain at least one number",
      );
    }
    setLoading(true);
    try {
      const req = await fetch("/auth/register/", {
        method: "POST",
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          name: form.name,
          number: form.phone,
        }),
        credentials: "include",
      });
      const res = await req.json();

      if (res.error) {
        setLoading(false);
        return setError(res.error);
      }
      setUser(res.user);
      navigate(from, { replace: true });
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
        {error && <Notify key={error} content={error} type="error" />}
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
            <ShowPassInput
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => {
                const val = e.target.value;
                setCheck({
                  character: val.length >= 8,
                  number: /[0-9]/.test(val),
                  special: /[!@#$%^&*]/.test(val),
                });
                setForm({ ...form, password: val });
              }}
            />
          </div>
          <div className={styles.passDiv}>
            <p>Confirm Password</p>
            <ShowPassInput
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) => {
                const val = e.target.value;
                setForm({ ...form, confirmPassword: val });
              }}
            />
          </div>
        </div>
        <div className={styles.passcheck}>
          <div>
            <CheckCircle2Icon
              size={24}
              color={check.character ? "green" : "black"}
            />{" "}
            &nbsp; Must be at least 8 characters
          </div>
          <div>
            <CheckCircle2Icon
              size={24}
              color={check.number ? "green" : "black"}
            />{" "}
            &nbsp; Include a number
          </div>
          <div>
            <CheckCircle2Icon
              size={24}
              color={check.special ? "green" : "black"}
            />
            &nbsp; Include a Special character
          </div>
        </div>
        <p>
          Phone Number <span>(optional)</span>
        </p>
        <input
          type="text"
          className={styles.phone}
          name="phone"
          placeholder="Enter your phone number"
          value={form.phone}
          onChange={(e) => {
            const val = e.target.value;
            setForm({ ...form, phone: val });
          }}
        />
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
          <p>
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
      </form>
    </main>
  );
}

export default SignUp;
