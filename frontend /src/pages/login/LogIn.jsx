import styles from "./LogIn.module.css";
import logo from "/favicon.svg";
import Button from "../../utilities/Button";

function LogIn() {
  return (
    <main className={styles.loginContainer}>
      <form action="">
        <h2>
          <img src={logo} alt="" /> SafetyTrack
        </h2>
        <h3>Welcome Back!</h3>
        <p className={styles.p1}>Log in to access your reporter dashboard.</p>
        <p>Email Address</p>
        <input
          type="email"
          className={styles.emailAddress}
          required
          autoFocus
        />
        <p>Password</p>
        <input type="password" className={styles.pass} required />
        <div className={styles.forgotPass}>
          <a href="">Forgot Password?</a>
        </div>
        <Button name="Log In" classStyle={styles.loginButton} />
        <div className={styles.donthaveAC}>
          <p>
            Don't have an account? <a href="">Sign Up.</a>
          </p>
        </div>
      </form>
    </main>
  );
}

export default LogIn;
