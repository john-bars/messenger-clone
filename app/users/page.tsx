"use client";

import { signOut } from "next-auth/react";

export default function User() {
  return <button onClick={() => signOut()}>Logout</button>;
}
