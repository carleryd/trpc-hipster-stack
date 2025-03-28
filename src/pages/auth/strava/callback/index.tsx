import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { trpc } from "~/utils/trpc";

const StravaAuthorization = ({
  stravaAccessCode,
}: {
  stravaAccessCode: string;
}) => {
  const { data, isPending } = trpc.getStravaAuthToken.useQuery({
    code: stravaAccessCode,
  });
  const router = useRouter();

  useEffect(() => {
    if (data?.access_token) {
      // TODO: Handle page route definitions centrally
      router.push({
        pathname: "/",
        query: { stravaAccessToken: data.access_token },
      });
    }
  }, [data?.access_token, router]);

  if (isPending) {
    return <div>Loading...</div>;
  } else {
    return <div>Hmm how did we end up here?</div>;
  }
};

export default () => {
  const searchParams = useSearchParams();
  const [stravaAccessCode, setStravaAccessCode] = useState<string | null>(null);

  useEffect(() => {
    const stravaAccessCode = searchParams.get("code");

    setStravaAccessCode(stravaAccessCode);
  }, []);

  return stravaAccessCode ? (
    <StravaAuthorization stravaAccessCode={stravaAccessCode} />
  ) : (
    <div>No access code in query parameters</div>
  );
};
