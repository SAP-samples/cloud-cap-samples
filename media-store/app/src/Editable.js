import React, { useEffect, useRef } from "react";

const Editable = ({ value, onChange, type }) => {
  const inputRef = useRef();

  useEffect(() => {
    const { current } = inputRef;

    current.value = value;

    const handleFocus = () => {
      console.log("input is focussed");
      // current.disabled = false;
      current.style.backgroundColor = "#f0f2f5";
    };
    const handleBlur = () => {
      console.log("input is blurred");
      // current.disabled = true;
      current.style.backgroundColor = "white";
    };

    const handleInput = (e) => onChange(e.target.value);

    current.addEventListener("focus", handleFocus);
    current.addEventListener("blur", handleBlur);
    current.addEventListener("input", handleInput);

    return () => {
      current.removeEventListener("focus", handleFocus);
      current.removeEventListener("blur", handleBlur);
      current.removeEventListener("input", handleInput);
    };
  });

  return (
    <input
      ref={inputRef}
      style={{
        fontWeight: 600,
        outline: "none",
        border: "none",
        borderRadius: 6,
        backgroundColor: "white",
        padding: "0 2px",
      }}
      type={type}
      name="task"
    />
  );
};

export { Editable };
