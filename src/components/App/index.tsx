"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ENV_VARS } from "~/utils/env";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/client";
import { useSession } from "next-auth/react";

// TODO: Does this exist in the Strava API?
const getStravaLoginUrl = ({
  clientId,
  redirectUri,
  scope,
}: {
  clientId: string;
  redirectUri: string;
  scope: "activity:read";
}) => {
  const baseUrl = "https://www.strava.com";
  const path = "/oauth/authorize";

  const url = new URL(baseUrl + path);

  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("approval_prompt", "auto");
  url.searchParams.set("scope", scope);

  console.log("### url", url.toString());

  return url.toString();
};

const ListActivities = () => {
  const trpc = useTRPC();

  const { data } = useQuery(trpc.getActivities.queryOptions());

  console.log("ListActivities stravaAccessToken", data);

  return <div>{JSON.stringify(data)}</div>;
};

export const App = () => {
  console.log("Rendering IndexPage");
  // const [stravaLoginUrl, setStravaLoginUrl] = useState<string | null>(null);
  // const searchParams = useSearchParams();
  // const stravaAccessToken = useMemo(
  //   () => searchParams.get("stravaAccessToken"),
  //   [searchParams],
  // );
  const { data: session } = useSession();
  console.log("session", session);

  // useEffect(() => {
  //   const url = getStravaLoginUrl({
  //     clientId: ENV_VARS.STRAVA_CLIENT_ID,
  //     redirectUri: `${window.location.origin}/auth/strava/callback`,
  //     scope: "activity:read",
  //   });

  //   setStravaLoginUrl(url);
  // }, []);

  return (
    <div>
      {session?.user ? (
        <Link href="/api/auth/signout">Sign out</Link>
      ) : (
        <Link href="/api/auth/signin">Sign in</Link>
      )}
      {session?.user && <ListActivities />}
    </div>
  );
};
