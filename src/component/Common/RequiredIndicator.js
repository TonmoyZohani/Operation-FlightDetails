import React from "react";

const RequiredIndicator = () => {
  return (
    <>
      <span
        style={{
          color: "var(--primary-color)",
          padding: "0 3px",
          fontSize: "16px",
        }}
      >
        *
      </span>
    </>
  );
};

export default RequiredIndicator;
