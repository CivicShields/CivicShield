function Button(props) {
  return (
    <button className={props.classStyle} onClick={props.onClick}>
      {props.name}
    </button>
  );
}

export default Button;
