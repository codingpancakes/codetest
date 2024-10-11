import React from "react";

const Widget = ({ title, theme }) => (
  <div style={{ ...styles.container, ...themes[theme] }}>
    <h3>{title}</h3>
    <p>This is your custom widget content.</p>
  </div>
);

const styles = {
  container: {
    padding: "16px",
    borderRadius: "8px",
    fontFamily: "Arial, sans-serif",
  },
};

const themes = {
  light: { backgroundColor: "#ffffff", color: "#000000" },
  dark: { backgroundColor: "#333333", color: "#ffffff" },
};

export default Widget;
