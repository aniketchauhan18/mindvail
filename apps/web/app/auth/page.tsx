import SignInWithGoogle from "@/components/buttons/signin-with-google";
import { getSession } from "@/lib/auth-client";
import { instrumentSerif } from "@/lib/fonts";
import { redirect } from "next/navigation";

interface AuthSearchParams {
  searchParams?: Promise<{
    redirectURL?: string;
  }>;
}

export default async function AuthPage({ searchParams }: AuthSearchParams) {
  const session = await getSession();
  if (session?.data?.user) {
    const url = (await searchParams)?.redirectURL
      ? `/${(await searchParams)?.redirectURL}`
      : "/";
    redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/${url}`);
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          {/* <h1 className="text-4xl font-semibold text-gray-900">
            <em style={{ fontStyle: 'italic' }} className={`italic ${instrumentSerif.className}`}>Mindvail</em>
          </h1> */}
        </div>
        <SignInWithGoogle />
      </div>
    </div>
  );
}
