type EnvVars = {
  STRAVA_CLIENT_ID: string;
  STRAVA_CLIENT_SECRET: string;
  STRAVA_SESSION_SECRET: string;
  NEXTAUTH_SECRET: string;
  WEBSITE_URL: string;
};

export const ENV_VARS = {
  STRAVA_CLIENT_ID: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID_PROD,
  // process.env.NODE_ENV === "development"
  //   ? process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID_DEV
  //   : process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID_PROD,
  STRAVA_CLIENT_SECRET: process.env.STRAVA_CLIENT_SECRET_PROD,
  // process.env.NODE_ENV === "development"
  //   ? process.env.STRAVA_CLIENT_SECRET_DEV
  //   : process.env.STRAVA_CLIENT_SECRET_PROD,
  STRAVA_SESSION_SECRET: process.env.STRAVA_SESSION_SECRET,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  WEBSITE_URL:
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_WEBSITE_URL_DEV
      : process.env.NEXT_PUBLIC_WEBSITE_URL_PROD,
} satisfies EnvVars;
