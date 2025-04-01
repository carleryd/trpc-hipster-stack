import { SessionProvider } from "~/providers/SessionProvider";
import { TRPCReactProvider } from "~/trpc/client";
import { auth } from "~/trpc/init";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

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
