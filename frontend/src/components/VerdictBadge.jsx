function VerdictBadge({ verdict }) {
  const styles = {
    Verified: "border-[#4A7A54]/40 bg-[#4A7A54]/10 text-[#4A7A54] dark:border-[#6E9277]/40 dark:bg-[#6E9277]/10 dark:text-[#8FB596]",
    Caution: "border-[#9C7A1F]/40 bg-[#9C7A1F]/10 text-[#9C7A1F] dark:border-[#C9A24B]/40 dark:bg-[#C9A24B]/10 dark:text-[#D6B26A]",
    "Red Flag": "border-[#A3392E]/40 bg-[#A3392E]/10 text-[#A3392E] dark:border-[#B5564A]/40 dark:bg-[#B5564A]/10 dark:text-[#D69187]",
    "Not enough data": "border-black/15 bg-black/[0.03] text-[#5A564F] dark:border-white/[0.12] dark:bg-white/[0.04] dark:text-[#9B968C]",
  };

  const displayText = verdict || "Not enough data";

  return (
    <span
      className={`h-fit rounded-full border px-4 py-2 text-sm font-medium ${
        styles[displayText] || styles["Not enough data"]
      }`}
    >
      {displayText}
    </span>
  );
}

export default VerdictBadge;