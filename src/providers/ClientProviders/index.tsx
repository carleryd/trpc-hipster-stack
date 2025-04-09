"use client";
import { SessionProvider } from "~/providers/SessionProvider";
import { TRPCReactProvider } from "~/trpc/client";
import { auth } from "~/trpc/init";

export default async function ClientProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  console.log("root session", session);

  return (
    <TRPCReactProvider>
      <SessionProvider session={session}>{children}</SessionProvider>
    </TRPCReactProvider>
  );
}
