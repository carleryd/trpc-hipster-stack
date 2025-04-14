"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export const NavBar = () => {
  const { data: session } = useSession();

  return (
    <AppBar position="static">
      <Toolbar>
        <Box>
          <Typography variant="h6">My Stride</Typography>
        </Box>
        <Box
          display="flex"
          flexGrow={1}
          justifyContent="space-between"
          marginLeft={3}
        >
          <Box>
            <Link href="/">
              <Button color="info">Home</Button>
            </Link>
          </Box>
          <Box>
            {session?.user ? (
              <Button color="info" onClick={() => signOut()}>
                Sign out
              </Button>
            ) : (
              <Button color="info" onClick={() => signIn("strava")}>
                Sign in
              </Button>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
