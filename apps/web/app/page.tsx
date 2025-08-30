import Navbar from "@/components/navbar";
import { instrumentSerif } from "@/lib/fonts";
import { clsx } from "@workspace/ui/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface BentoGridItem {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const bentoGridContent: BentoGridItem[] = [
  {
    title: "Personalized Well-being Assessment",
    subtitle: "Understand your mental health.",
    description:
      "Answer a few thoughtful questions to receive insights into your mood and emotional wellbeing-all private, with instant feedback tailored just for you.",
    image: "/icons/assessment.png",
  },
  {
    title: "Confidential Progress Tracking",
    subtitle: "Your journey, your pace.",
    description:
      "Securely monitor your feelings and responses over time. Only you can access your trends-empowering you to notice positive changes or seek help when needed.",
    image: "/icons/progress.png",
  },
  {
    title: "End-to-End Encryption",
    subtitle: "Your privacy, always protected.",
    description:
      "All your answers are encrypted, even while being analyzed by our machine learning model. No raw data leaves your device-your story is yours alone.",
    image: "/icons/encryption.png",
  },
  {
    title: "Research-backed Insights",
    subtitle: "Science you can trust.",
    description:
      "Receive clear, interpretable results using proven mental health models. Made to help you understand, not overwhelm-so you can take informed next steps.",
    image: "/icons/insights.png",
  },
];

export default async function Page() {
  const rotateClasses = `${instrumentSerif.className} rotate-3 inline-block hover:rotate-0 duration-200 ease-out transition-all text-blue-600`;
  return (
    <>
      <Navbar />
      <div className="min-h-screen my-20">
        <div className="min-h-64 md:min-h-96 lg:min-h-[28rem] flex flex-col justify-center items-center">
          <div className="sm:max-w-4xl relative cursor-default text-center text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-6xl font-medium">
            <h3>
              From{" "}
              <span style={{ fontStyle: "italic" }} className={rotateClasses}>
                Self-Reflection
              </span>{" "}
              to Clarity, All
            </h3>
            <h3>
              in One Space,{" "}
              <span style={{ fontStyle: "italic" }} className={rotateClasses}>
                Securely
              </span>
            </h3>
          </div>
          <p className="text-xs sm:text-sm lg:text-base font-light text-neutral-700 px-10 text-center mt-3 max-w-xl md:max-w-2xl xl:max-w-4xl xl:text-lg">
            Whether you're checking in for self-awareness or exploring your
            well-being, our app guides you every step of the way-with privacy,
            clarity, and support.
          </p>

          <div className="flex justify-center items-center mt-4">
            <Link
              href="/assessment"
              className="rounded-sm group overflow-hidden font-light text-xs sm:text-sm smooth px-3 py-1 lg:px-3 h-6.5 sm:h-8 lg:py-2 flex items-center justify-center text-white bg-gradient-to-b from-blue-500 to-blue-600 border-b-[1.25px] border-blue-700 hover:opacity-90 hover:bg-blue-600/90"
            >
              Assessment
              <div className="relative ml-1 w-3 lg:w-4 h-3 lg:h-4">
                <ArrowUpRight className="absolute w-3 lg:w-4 h-3 lg:h-4 text-white group-hover:-translate-y-[2rem] transition-all duration-300 cubic-bezier(0.785, 0.135, 0.15, 0.86)" />
                <ArrowUpRight className="absolute w-3 lg:w-4 h-3 lg:h-4 text-white translate-y-[2rem] group-hover:translate-y-0 transition-all duration-300 cubic-bezier(0.785, 0.135, 0.15, 0.86)" />
              </div>
            </Link>
          </div>
        </div>
        <div className="grid px-5 md:px-7 sm:grid-cols-2 lg:px-12 lg:grid-cols-5 gap-5">
          {bentoGridContent.map((content, idx) => (
            <div
              key={content.title}
              className={clsx(
                "flex h-full w-full justify-center items-center",
                {
                  "lg:col-span-3": idx == 1 || idx == 2,
                  "lg:col-span-2": idx == 0 || idx == 3,
                },
              )}
            >
              <div className="p-3 h-full w-full flex flex-col justify-between rounded-2xl space-y-1">
                <div className="flex-1">
                  <h3
                    className={`${instrumentSerif.className} text-xl lg:text-2xl`}
                  >
                    {content.title}
                  </h3>
                  <p className="font-light text-xs md:text-sm xl:text-base text-neutral-500">
                    {content.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* <Pricing /> */}
      </div>
    </>
  );
}
