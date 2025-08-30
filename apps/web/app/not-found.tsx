import { Button } from "@workspace/ui/components/button";
import { instrumentSerif } from "@/lib/fonts";
import { IconHome } from "@tabler/icons-react";
import BackButton from "@/components/buttons/back-button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found - Mindvail",
  description: "The page you are looking for does not exist in Mindvail",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <h1
          className={`mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl ${instrumentSerif.className}`}
        >
          Oops, <span className="text-blue-600">page</span> not found!
        </h1>
        <p className="mt-4 text-neutral-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="">
            <Button className="gap-1 font-light h-8 rounded-full hover:opacity-90 duration-200 transition-all ease-out">
              <IconHome />
              Home
            </Button>
          </Link>
          <Link href="/" className="">
            <BackButton
              buttonText="Back"
              className="gap-1 font-light bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-none  h-8 px-10 rounded-full cursor-pointer hover:opacity-90 duration-200 transition-all ease-out"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
