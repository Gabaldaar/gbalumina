import React from "react";

const styles = {
  base: {
    fontFamily: "Inter",
    fontSize: "14px",
    fontWeight: 500,
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.15s ease-in-out",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center"
  },

  primary: {
    backgroundColor: "#3B82F6",
    color: "white",
    border: "1px solid #3B82F6",
    padding: "10px 16px"
  },

  primaryHover: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB"
  },

  secondary: {
    backgroundColor: "#F3F4F6",
    color: "#374151",
    border: "1px solid #D1D5DB",
    padding: "8px 14px"
  },

  secondaryHover: {
    backgroundColor: "#E5E7EB"
  },

  ghost: {
    backgroundColor: "transparent",
    color: "#374151",
    border: "none",
    padding: "6px 8px"
  },

  ghostHover: {
    backgroundColor: "#F3F4F6"
  }
};

const Button = ({ variant = "primary", children, style = {}, ...props }) => {
  const variantStyle = styles[variant];
  const hoverStyle = styles[variant + "Hover"];

  const [hover, setHover] = React.useState(false);

  return (
    <button
      {...props}
      style={{
        ...styles.base,
        ...variantStyle,
        ...(hover ? hoverStyle : {}),
        ...style
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </button>
  );
};

export default Button;
