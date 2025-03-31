declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_STRAVA_CLIENT_ID_DEV: string;
    NEXT_PUBLIC_STRAVA_CLIENT_ID_PROD: string;
    STRAVA_CLIENT_SECRET_DEV: string;
    STRAVA_CLIENT_SECRET_PROD: string;
    STRAVA_ACCESS_TOKEN_DEV: string;
    STRAVA_ACCESS_TOKEN_PROD: string;
    STRAVA_SESSION_SECRET: string;
  }
}
