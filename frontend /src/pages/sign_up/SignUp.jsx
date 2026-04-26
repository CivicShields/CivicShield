import styles from "./SignUp.module.css";
import logo from "/favicon.svg";
import Button from "../../utilities/Button";
import createUser from "./signup";

function SignUp() {
  return (
    <main className={styles.signupContainer}>
      <form className="signupform">
        <h2>
          <img src={logo} alt="SafetyTrack " /> SafetyTrack
        </h2>
        <h3>Create Your Account</h3>
        <p className={styles.p1}>
          Join our community of responders and help <br /> make your
          neighborhood safer
        </p>
        <p>Full Name</p>
        <input type="text" className={styles.fullName} required autoFocus />
        <br />
        <input
          type="email"
          className={styles.emailDetail}
          placeholder="Email Address"
          required
        />
        <div className={styles.passContainer}>
          <div className={styles.passDiv}>
            <p>Create Password</p>
            <input type="password" className="first-pass" required />
          </div>
          <div className={styles.passDiv}>
            <p>Confirm Password</p>
            <input type="password" className="confirm-pass" required />
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
          <Button name="Sign Up" classStyle={styles.signupButton} />
          <p>
            Already have an account? <a href="">Log In</a>
          </p>
        </div>
      </form>
    </main>
  );
}

export default SignUp;
