import React from "react";

// Lightweight stroke icons that inherit color via `currentColor`.
// Sized in em so they scale with surrounding text; pass a className for layout.

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  width: "1em",
  height: "1em",
  "aria-hidden": true,
  focusable: false,
};

export function IconHouse({ className }) {
  return (
    <svg {...base} className={className}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

export function IconEnvelope({ className }) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <path d="M3.5 7 12 13l8.5-6" />
    </svg>
  );
}

export function IconMailbox({ className }) {
  return (
    <svg {...base} className={className}>
      <path d="M4 10a4 4 0 0 1 8 0v8H6a2 2 0 0 1-2-2z" />
      <path d="M12 10h6a2 2 0 0 1 2 2v6h-8" />
      <path d="M8 10v4" />
      <path d="M16 18v3" />
    </svg>
  );
}
