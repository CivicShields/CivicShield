import { CheckCircle2Icon, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function ShowPassInput({ autoFocus = false, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  if (showPassword === true)
    setTimeout(() => {
      setShowPassword(false);
    }, 2000);
  return (
    <div
      className={props.className}
      style={{ position: "relative", width: "100%" }}
    >
      <input
        type={showPassword ? "text" : "password"}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        onClick={props.onClick}
        autoFocus={autoFocus}
        required
        className={props.className}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          border: "none",
          background: "none",
          cursor: "pointer",
        }}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}

export default ShowPassInput;
