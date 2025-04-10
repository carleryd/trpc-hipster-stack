declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_STRAVA_CLIENT_ID: string;
    NEXT_PUBLIC_WEBSITE_URL: string;

    STRAVA_CLIENT_SECRET: string;
    STRAVA_ACCESS_TOKEN: string;
    STRAVA_SESSION_SECRET: string;

    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
  }
}
