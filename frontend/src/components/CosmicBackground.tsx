import React from "react";
import {
  DollarSign,
  TrendingUp,
  Coins,
  CreditCard,
  Building2,
  Wallet,
  ArrowUpRight,
  Receipt,
  Percent,
  Landmark,
  ShieldCheck,
  Scale,
  CircleDollarSign,
  Banknote,
} from "lucide-react";

interface CosmicBackgroundProps {
  darkMode: boolean;
}

// Curated list of floating finance icons with organic positioning and restrained opacity
const floatingFinanceIcons = [
  { Icon: DollarSign, left: "7%", duration: "28s", delay: "0s", size: 26, rotate: "-12deg" },
  { Icon: TrendingUp, left: "18%", duration: "34s", delay: "-8s", size: 28, rotate: "15deg" },
  { Icon: Coins, left: "32%", duration: "24s", delay: "-14s", size: 24, rotate: "8deg" },
  { Icon: CreditCard, left: "45%", duration: "36s", delay: "-4s", size: 30, rotate: "-18deg" },
  { Icon: Building2, left: "58%", duration: "30s", delay: "-19s", size: 26, rotate: "10deg" },
  { Icon: Wallet, left: "70%", duration: "26s", delay: "-7s", size: 25, rotate: "-15deg" },
  { Icon: ArrowUpRight, left: "82%", duration: "32s", delay: "-12s", size: 24, rotate: "4deg" },
  { Icon: Landmark, left: "93%", duration: "38s", delay: "-22s", size: 28, rotate: "-8deg" },
  { Icon: Banknote, left: "12%", duration: "35s", delay: "-17s", size: 28, rotate: "14deg" },
  { Icon: Percent, left: "25%", duration: "27s", delay: "-2s", size: 22, rotate: "-10deg" },
  { Icon: CircleDollarSign, left: "39%", duration: "33s", delay: "-15s", size: 26, rotate: "20deg" },
  { Icon: Receipt, left: "52%", duration: "29s", delay: "-25s", size: 24, rotate: "-12deg" },
  { Icon: ShieldCheck, left: "64%", duration: "37s", delay: "-10s", size: 27, rotate: "6deg" },
  { Icon: Scale, left: "78%", duration: "31s", delay: "-5s", size: 25, rotate: "-14deg" },
  { Icon: DollarSign, left: "88%", duration: "25s", delay: "-18s", size: 24, rotate: "12deg" },
];

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({ darkMode }) => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {darkMode ? (
        // Dark Mode: Solid multi-stop deep midnight-obsidian-indigo gradient
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-[#090D18] via-[#0E1526] to-[#170E1B]" />
          {/* Strong radiant ambient gradient glows */}
          <div className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-[#831C35]/20 to-transparent blur-[140px]" />
          <div className="absolute top-1/3 -right-32 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#1E3A8A]/20 to-transparent blur-[150px]" />
          <div className="absolute -bottom-32 left-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[#16805C]/15 to-transparent blur-[140px]" />
        </>
      ) : (
        // Light Mode: Solid crisp platinum-slate gradient with warm bordeaux and cool indigo radial accents
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-[#F4F6FA] via-[#EDF2F8] to-[#F9EFF3]" />
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#831C35]/10 to-transparent blur-[120px]" />
          <div className="absolute top-1/4 -right-32 w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-[#1E3A8A]/8 to-transparent blur-[130px]" />
          <div className="absolute -bottom-32 left-1/3 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#16805C]/8 to-transparent blur-[120px]" />
        </>
      )}

      {/* Moving Floating Finance Icons with subtle design token borders */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingFinanceIcons.map(({ Icon, left, duration, delay, size, rotate }, index) => (
          <div
            key={`finance-icon-${index}`}
            className="absolute -bottom-16 float-finance-item transition-opacity"
            style={{
              left,
              animation: `floatFinance ${duration} linear infinite`,
              animationDelay: delay,
              transform: `rotate(${rotate})`,
            }}
          >
            <div
              className={`p-2.5 rounded-2xl transition-all duration-300 ${
                darkMode
                  ? "text-[#817376]/35 border border-[#36272B]/60 bg-[#1B1215]/50 shadow-xs"
                  : "text-[#A49799]/45 border border-[#E8E1E2]/80 bg-white/70 shadow-xs"
              }`}
            >
              <Icon size={size} strokeWidth={1.5} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
