import type { Metadata } from "next";
import { Jost, Quicksand } from "next/font/google";
import AppProviders from "@/components/wrappers/AppProviders";
import logo from '@/assets/images/logo.png'
import { DEFAULT_PAGE_TITLE } from "@/common/constants";
import Image from "next/image";
import Background2 from "@/components/Background2";
import TopNavbar from "@/components/TopNavbar";
import { navLinks } from "./data";
import Footer4 from "./components/Footer4";

import 'aos/dist/aos.css';
import "../assets/css/style.css";

const jostSans = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  style: "normal",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  style: "normal",
});

export const metadata: Metadata = {
  title: {
    template: '%s | Helping Hand AI Solutions',
    default: DEFAULT_PAGE_TITLE,
  },
  description:
    'Helping Hand AI Solutions builds startup MVPs faster with AI-driven development. Flexible engagement: execution-only, shared commitment, or full partnership. From idea to scalable product in weeks.',
  keywords: [
    'AI software development',
    'startup MVP',
    'AI-driven development',
    'Helping Hand AI Solutions',
    'custom AI solutions',
    'startup development',
  ],
  openGraph: {
    title: DEFAULT_PAGE_TITLE,
    description:
      'Build your startup MVP faster with AI-driven development. Flexible engagement models that lower costs and align our success with yours.',
    type: 'website',
  },
}

const splashScreenStyles = `
#splash-screen {
  position: fixed;
  top: 50%;
  left: 50%;
  background: #491c53;
  display: flex;
  height: 100%;
  width: 100%;
  transform: translate(-50%, -50%);
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 1;
  transition: all 15s linear;
  overflow: hidden;
}

#splash-screen.remove {
  animation: fadeout 0.7s forwards;
  z-index: 0;
}

@keyframes fadeout {
  to {
    opacity: 0;
    visibility: hidden;
  }
}
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
        <style suppressHydrationWarning>{splashScreenStyles}</style>
      </head>
      <body
        className={`${quicksand.className} ${jostSans.className} bg-default-900`}
      >
        <div id="splash-screen">
          <Image alt="logo-text" src={logo} style={{ height: '10%', width: 'auto' }} priority />
        </div>
        <div id="__next_splash">
          <AppProviders>
            <Background2 />
            <TopNavbar navLinks={navLinks} />
              {children}
            <Footer4 />
          </AppProviders>
        </div>
      </body>
    </html>
  );
}
