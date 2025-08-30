"use client";
import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { instrumentSerif } from "@/lib/fonts";
import { IconMenu, IconSearch, IconX } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function HamburgerMenu() {
  const isMobile = useIsMobile();
  const { data, isPending, refetch } = useSession();
  const [showSubMenu, setShowSubMenu] = React.useState(false);
  const router = useRouter();

  const handleSignOut = React.useCallback(async () => {
    try {
      const res = await signOut({
        fetchOptions: {
          onSuccess: () => {
            refetch();
            router.push("/");
          },
        },
      });
      console.log("Sign out response:", res);
    } catch (error) {
      console.log(error);
    }
  }, [refetch, router]);

  const linkClasses =
    "text-white text-2xl flex items-center gap-3 hover:scale-99 transition-all duration-200 ease-out";

  return (
    <>
      {isMobile ? (
        <div>
          <IconMenu
            className="cursor-pointer text-black w-4"
            onClick={() => setShowSubMenu(true)}
          />
        </div>
      ) : (
        <div>
          {data?.user ? (
            <Button
              size="sm"
              variant="outline"
              onClick={handleSignOut}
              className="shadow-none h-7 font-normal bg-gradient-to-b from-red-500 to-red-600 text-white border-none hover:text-white"
            >
              Sign out
            </Button>
          ) : (
            <Link href={`/auth`} prefetch className="w-fit h-fit">
              <Button
                size="sm"
                variant="outline"
                className="shadow-none h-7 font-normal bg-gradient-to-b from-blue-500 to-blue-600 text-white border-none hover:text-white"
              >
                Signin
              </Button>
            </Link>
          )}
        </div>
      )}
      {showSubMenu && isMobile && (
        <div
          className={`inset-0 fixed bg-white top-0 left-0 animate-in bg-torea-bay-700 z-50 p-6 px-7 $`}
        >
          <div className="flex items-center justify-between">
            <Link href="/" className={`text-lg ${instrumentSerif.className}`}>
              Mindvail
            </Link>
            <IconX
              className="cursor-pointer w-4"
              onClick={() => setShowSubMenu(false)}
            />
          </div>
          <div className="mt-4 space-y-3"></div>
        </div>
      )}
    </>
  );
}
