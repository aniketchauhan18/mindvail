"use client";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";
import { UndoIcon } from "lucide-react";

export default function BackButton({
  buttonText,
  className,
}: { buttonText: string } & React.ComponentProps<"button">) {
  const router = useRouter();
  return (
    <Button onClick={() => router.back()} className={cn(className)}>
      <UndoIcon className="w-4 h-4" />
      {buttonText}
    </Button>
  );
}
