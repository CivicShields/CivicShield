function Button(props) {
  return (
    <button
      className={props.classStyle}
      onClick={props.onClick}
      type={props.type}
      disabled={props.disabled}
    >
      {props.name}
    </button>
  );
}

export default Button;
