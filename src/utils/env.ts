type EnvVars = {
  STRAVA_CLIENT_ID: string;
  STRAVA_CLIENT_SECRET: string;
  STRAVA_ACCESS_TOKEN: string;
  STRAVA_SESSION_SECRET: string;
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
  STRAVA_ACCESS_TOKEN: process.env.STRAVA_ACCESS_TOKEN_PROD,
  // process.env.NODE_ENV === "development"
  //   ? process.env.STRAVA_ACCESS_TOKEN_DEV
  //   : process.env.STRAVA_ACCESS_TOKEN_PROD,
  STRAVA_SESSION_SECRET: process.env.STRAVA_SESSION_SECRET,
} satisfies EnvVars;
