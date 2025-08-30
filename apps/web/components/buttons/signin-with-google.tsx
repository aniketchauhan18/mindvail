"use client";
import { Button } from "@workspace/ui/components/button";
import { signIn } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";

export default function SignInWithGoogle({
  redirectURL,
}: {
  redirectURL?: string;
}) {
  return (
    <Button
      onClick={async () => {
        try {
          await signIn.social({
            provider: "google",
            callbackURL: redirectURL
              ? `${process.env.NEXT_PUBLIC_BASE_URL}${redirectURL}`
              : process.env.NEXT_PUBLIC_BASE_URL,
          });
        } catch (error) {
          console.error(error);
        }
      }}
      type="button"
      className="shadow-none text-neutral-700 h-8 hover:bg-neutral-100/30 flex items-center bg-transparent rounded-lg border w-full transition duration-150 font-normal ease-in-out border-neutral-200/95"
    >
      <FcGoogle />
      Sign in with Google
    </Button>
  );
}
