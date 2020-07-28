import React from "react";

const Highlighted = ({ text = "", highlight = "" }) => {
  const escaped = highlight.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!escaped.length) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${escaped})`, "gi");

  const parts = text.split(regex);
  return (
    <span>
      {parts
        .filter(part => part)
        .map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
    </span>
  );
};

export { Highlighted };
