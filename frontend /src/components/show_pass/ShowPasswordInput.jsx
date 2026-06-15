import { CheckCircle2Icon, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react"; // 1. Added useEffect

function ShowPassInput({ autoFocus = false, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!showPassword) return;
    const timer = setTimeout(() => {
      setShowPassword(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [showPassword]);

  return (
    <div
      className={props.className}
      style={{
        position: "relative",
        width: "100%",
        display: "inline-block", // Ensures container conforms to layout width
        boxSizing: "border-box",
        direction: "flex",
        justifyContent: "space-between",
      }}
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
        style={{
          width: "100%",
          paddingRight: "40px",
          boxSizing: "border-box",
        }}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          border: "none",
          background: "none",
          color: "black",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0",
        }}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}

export default ShowPassInput;
