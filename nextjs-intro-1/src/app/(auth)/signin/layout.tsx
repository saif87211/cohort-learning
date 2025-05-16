import React from "react";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      This layout is in /sign in page
      {children}
    </div>
  );
}
