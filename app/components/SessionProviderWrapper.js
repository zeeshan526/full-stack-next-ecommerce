// app/components/SessionProviderWrapper.js

"use client"; // Mark this as a client component

import { SessionProvider } from "next-auth/react";

export default function SessionProviderWrapper({ children, session }) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
