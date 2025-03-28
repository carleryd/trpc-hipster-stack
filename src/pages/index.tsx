/**
 * This is a Next.js page.
 */
import React, { useEffect, useMemo, useState } from "react";
import { trpc } from "../utils/trpc";
import Link from "next/link";
import { ENV_VARS } from "~/utils/env";
import { useSearchParams } from "next/navigation";

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

const ListActivities = ({
  stravaAccessToken,
}: {
  stravaAccessToken: string;
}) => {
  const { data } = trpc.getActivities.useQuery({ stravaAccessToken });

  console.log("ListActivities stravaAccessToken", data, stravaAccessToken);

  return <div>{JSON.stringify(data)}</div>;
};

export default function IndexPage() {
  console.log("Rendering IndexPage");
  const [stravaLoginUrl, setStravaLoginUrl] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const stravaAccessToken = useMemo(
    () => searchParams.get("stravaAccessToken"),
    [searchParams],
  );

  useEffect(() => {
    const url = getStravaLoginUrl({
      clientId: ENV_VARS.STRAVA_CLIENT_ID,
      redirectUri: `${window.location.origin}/auth/strava/callback`,
      scope: "activity:read",
    });

    setStravaLoginUrl(url);
  }, []);

  return (
    <div>
      {stravaLoginUrl && <Link href={stravaLoginUrl}>Login</Link>}
      {stravaAccessToken && (
        <ListActivities stravaAccessToken={stravaAccessToken} />
      )}
    </div>
  );
}
