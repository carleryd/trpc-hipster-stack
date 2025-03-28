/**
 * This is a Next.js page.
 */
import React, { useCallback, useEffect, useState } from "react";
import { trpc } from "../utils/trpc";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ENV_VARS } from "~/utils/env";

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

const StravaAuthed = ({ accessToken }: { accessToken: string }) => {
  const { data } = trpc.getActivities.useQuery({ accessToken });

  console.log("StravaAuthed accessToken", data, accessToken);

  return <div>{JSON.stringify(data)}</div>;
};

const StravaStuff = ({ accessCode }: { accessCode: string }) => {
  const { data } = trpc.getStravaAccessToken.useQuery({
    code: accessCode,
  });

  console.log("StravaStuff data", data);
  console.log("StravaStuff accessCode", accessCode);

  return data && <StravaAuthed accessToken={data.access_token} />;
};

export default function IndexPage() {
  console.log("Rendering IndexPage");
  const [stravaLoginUrl, setStravaLoginUrl] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const stravaAccessCode = searchParams.get("code");

  useEffect(() => {
    const url = getStravaLoginUrl({
      clientId: ENV_VARS.STRAVA_CLIENT_ID,
      redirectUri: window.location.origin,
      scope: "activity:read",
    });

    setStravaLoginUrl(url);
  }, []);

  return (
    <div>
      {stravaLoginUrl && <Link href={stravaLoginUrl}>Login</Link>}
      {stravaAccessCode && <StravaStuff accessCode={stravaAccessCode} />}
    </div>
  );
}
