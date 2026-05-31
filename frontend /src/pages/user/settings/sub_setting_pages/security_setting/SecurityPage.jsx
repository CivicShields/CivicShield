import styles from "./SecurityPage.module.css";
import { CheckCircle2Icon } from "lucide-react";
import Button from "../../../../../components/button/Button";
import { useState } from "react";
import { useAuth } from "../../../../../contexts/AuthContext";
import ShowPassInput from "../../../../../components/show_pass/ShowPasswordInput";
import Notify from "../../../../../components/notify/Notify";

function SecurityPage() {
  const redAsterik = <span style={{ color: "red" }}>*</span>;
  const { changePassword } = useAuth();
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNew: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [check, setCheck] = useState({
    character: false,
    number: false,
    special: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.newPassword !== form.confirmNew) {
      return setError("New passwords do not match");
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
      const changePass = await changePassword(
        form.oldPassword,
        form.newPassword,
      );
      if (changePass.error) {
        setLoading(false);
        return setError(changePass.error);
      }
      setSuccess(changePass.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.sectionB}>
      <h2>Security & Password</h2>
      <form className={styles.container} onSubmit={handleSubmit}>
        <p>Manage your password</p>
        <h2>Change Your Password</h2>
        <h3>Update Your Password </h3>
        <label>Current Password {redAsterik}</label>
        {error && <Notify key={error} content={error} type="error" />}
        {success && <Notify key={success} content={success} type="success" />}
        <ShowPassInput
          autoFocus={true}
          placeholder="Current password"
          value={form.oldPassword}
          onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
        />
        <label> New Password {redAsterik}</label>
        <ShowPassInput
          placeholder="New password"
          value={form.newPassword}
          onChange={(e) => {
            const val = e.target.value;
            setCheck({
              character: val.length >= 8,
              number: /[0-9]/.test(val),
              special: /[!@#$%^&*]/.test(val),
            });
            setForm({ ...form, newPassword: val });
          }}
        />

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
        <label>Confirm New Password {redAsterik}</label>
        <ShowPassInput
          placeholder="Confirm new password"
          value={form.confirmNew}
          onChange={(e) => setForm({ ...form, confirmNew: e.target.value })}
        />
        <Button
          classStyle={styles.changepass}
          name={loading ? "...changing password" : "change password"}
          type="submit"
          disable={loading}
        />
      </form>
    </section>
  );
}

export default SecurityPage;
