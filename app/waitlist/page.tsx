import React from "react";
import WaitlistAdmin from "./WaitlistAdmin";

export default function WaitlistPage() {
  return (<WaitlistAdmin />) as unknown as React.ReactElement;
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "0.6rem 0.75rem",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
  color: "#223",
};

const td: React.CSSProperties = {
  padding: "0.6rem 0.75rem",
  borderBottom: "1px solid rgba(0,0,0,0.04)",
};
