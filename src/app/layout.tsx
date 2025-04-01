import { getServerSession } from "next-auth";
import { SessionProvider } from "~/providers/SessionProvider";
import { TRPCReactProvider } from "~/trpc/client";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  console.log("root session", session);

  return (
    <html>
      <body>
        <TRPCReactProvider>
          <SessionProvider session={session}>{children}</SessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
