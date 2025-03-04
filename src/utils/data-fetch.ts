import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/auth-js";

type GetUserSubscriptionResult = {
  user: User | null;
  openAppQueryParams: string;
  redirect: string | null;
};

export const getUser = async (): Promise<GetUserSubscriptionResult> => {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return {
      user: null,
      openAppQueryParams: "",
      redirect: "/",
    };
  }
  const { data: sessionData } = await supabase.auth.refreshSession();
  const openAppQueryParams = `accessToken=${sessionData?.session?.access_token}&refreshToken=${sessionData?.session?.refresh_token}`;

  return {
    user: userData.user,
    openAppQueryParams,
    redirect: null,
  };
};
