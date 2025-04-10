"use client";
import { SessionProvider } from "~/providers/SessionProvider";
import { TRPCReactProvider } from "~/trpc/client";

export default function ClientProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCReactProvider>
      <SessionProvider>{children}</SessionProvider>
    </TRPCReactProvider>
  );
}
