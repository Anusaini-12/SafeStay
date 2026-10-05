import { BadgeCheck } from "lucide-react";

function VerdictBadge({ verdict }) {
  const styles = {
    Verified:
      "verified-badge border-[#4A7A54]/40 bg-gradient-to-r from-[#E8F4E9] to-[#D8EBDD] text-[#285C34] shadow-[0_4px_18px_rgba(74,122,84,0.16)] dark:from-[#24392A] dark:to-[#1E3024] dark:text-[#A9D7B0]",
    Caution: "border-[#9C7A1F]/40 bg-[#9C7A1F]/10 text-[#9C7A1F] dark:border-[#C9A24B]/40 dark:bg-[#C9A24B]/10 dark:text-[#D6B26A]",
    "Red Flag": "border-[#A3392E]/40 bg-[#A3392E]/10 text-[#A3392E] dark:border-[#B5564A]/40 dark:bg-[#B5564A]/10 dark:text-[#D69187]",
    "Not enough data": "border-black/15 bg-black/[0.03] text-[#5A564F] dark:border-white/[0.12] dark:bg-white/[0.04] dark:text-[#9B968C]",
  };

  const displayText = verdict || "Not enough data";
  const isVerified = displayText === "Verified";

  return (
    <span
      aria-label={
        isVerified
          ? "Verified assessment based on available public evidence"
          : displayText
      }
      className={`h-fit rounded-full border px-4 py-2 text-sm font-medium ${
        styles[displayText] || styles["Not enough data"]
      } ${isVerified ? "inline-flex items-center gap-2 px-4 py-2.5 font-semibold" : ""}`}
    >
      {isVerified && <BadgeCheck size={17} strokeWidth={2.2} />}
      {displayText}
    </span>
  );
}

export default VerdictBadge;