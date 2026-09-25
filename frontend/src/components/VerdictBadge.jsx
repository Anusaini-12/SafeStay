function VerdictBadge({ verdict }) {
  const styles = {
    Verified: "border-[#6E9277]/40 bg-[#6E9277]/10 text-[#8FB596]",
    Caution: "border-[#C9A24B]/40 bg-[#C9A24B]/10 text-[#D6B26A]",
    "Red Flag": "border-[#B5564A]/40 bg-[#B5564A]/10 text-[#D69187]",
    "Not enough data": "border-white/[0.12] bg-white/[0.04] text-[#9B968C]",
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
