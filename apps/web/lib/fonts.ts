import {
  Instrument_Serif,
  Geist,
  Geist_Mono,
  DM_Sans,
  Playfair,
} from "next/font/google";

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
});

export const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const playFair = Playfair({
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
  preload: false,
});

export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
    "1000",
  ],
});
