type RulerDiagramProps = {
  length: number;
  broken: boolean;
  missionId: string;
  repaired: boolean;
  repairs?: string[];
};

export function RulerDiagram({ length, broken, missionId, repaired, repairs = [] }: RulerDiagramProps) {
  const overlapFixed = repairs.includes("remove-overlap");
  const gapFixed = repairs.includes("close-gap");
  const originFixed = repairs.includes("align-origin");
  const unitsFixed = repairs.includes("normalize-units");
  const labelsFixed = repairs.includes("restore-labels");
  const extra = broken && missionId === "overlapping-unit-tiles" && !overlapFixed ? 1 : 0;
  const gapBroken = broken && missionId === "gapped-unit-tiles" && !gapFixed;
  const overlapBroken = broken && (missionId === "overlapping-unit-tiles" || missionId === "boundary-and-combined-repair") && !overlapFixed;
  const unequalBroken = broken && missionId === "unequal-unit-widths" && !unitsFixed;
  const labelsBroken = broken && missionId === "boundary-and-combined-repair" && !labelsFixed;
  const originBroken = broken && missionId === "misaligned-zero-start" && !originFixed;
  const originOffset = originBroken ? 1 : 0;
  const blocks = Array.from({ length: length + extra }, (_, index) => index);
  const description = !broken || repaired
    ? `물체 시작 0, 끝 ${length}, 같은 크기 칸 ${length}개.`
    : originBroken
      ? `물체 시작은 눈금 1, 끝은 눈금 ${length + 1}이에요. 0에 맞추기 전에는 끝 숫자만 읽지 않아요.`
      : gapBroken
        ? "칸 사이에 빈틈이 있어요. 빈 공간은 칸으로 세지 않아요."
        : unequalBroken
          ? "작은 칸과 큰 칸이 섞여 7cm처럼 읽었어요. 같은 크기 칸으로 다시 봐요."
          : missionId === "boundary-and-combined-repair"
            ? overlapBroken && labelsBroken
              ? "칸이 겹치고 눈금 숫자 차례도 달라요."
              : overlapBroken
                ? "칸 일부가 겹쳐 있어요. 같은 곳을 두 번 덮지 않게 해요."
                : "눈금 숫자 차례가 달라요. 0, 1, 2처럼 다시 봐요."
            : "칸 일부가 겹쳐 있어요. 같은 곳을 두 번 세지 않아요.";

  return (
    <figure className={`ruler-figure ${repaired ? "is-repaired" : ""}`}>
      <svg aria-hidden="true" className="ruler-svg" viewBox="0 0 840 230">
        <defs><pattern height="8" id="overlap-pattern" patternUnits="userSpaceOnUse" width="8"><path d="M-2 2L2-2M0 8L8 0M6 10L10 6" stroke="#8a4817" strokeWidth="2" /></pattern></defs>
        <rect className="object-bar" height="28" rx="12" width={length * 88} x={72} y="35" />
        <text className="object-label" x="72" y="25">재는 물체</text>
        <line className="guide-line" x1="72" x2="72" y1="62" y2="190" />
        {blocks.map((block) => {
          const hasGap = gapBroken && block >= 2;
          const hasOverlap = overlapBroken && block >= 3;
          const unequal = unequalBroken;
          const width = unequal ? [62, 110, 76, 112, 70, 98][block % 6] : 88;
          const x = 72 + (block + originOffset) * 88 + (hasGap ? 36 : 0) - (hasOverlap ? 28 : 0);
          return <rect className={`unit-block ${unequal ? "unequal" : ""} ${hasOverlap ? "overlap" : ""}`} height="72" key={block} rx="4" width={width} x={x} y="102" />;
        })}
        {Array.from({ length: length + 1 }, (_, index) => {
          const x = 72 + index * 88;
          const label = labelsBroken && index === 4 ? 3 : broken && missionId === "unequal-unit-widths" && !unitsFixed && index === length ? 7 : index;
          return <g key={`line-${index}`}><line className="tick" x1={x} x2={x} y1="86" y2="190" /><text className="tick-label" x={x - 5} y="210">{label}</text></g>;
        })}
        {gapBroken && <text className="fault-tag" x="275" y="97">틈</text>}
        {overlapBroken && <text className="fault-tag" x="308" y="97">겹침</text>}
        {labelsBroken && <text className="fault-tag" x="390" y="97">숫자 차례</text>}
        {unequalBroken && <text className="fault-tag" x="242" y="97">크기 다름</text>}
        {originBroken && <text className="fault-tag" x="135" y="97">0이 여기예요</text>}
      </svg>
      <figcaption>{description} 화면의 칸은 실제 1cm가 아닌 모형이에요.</figcaption>
    </figure>
  );
}
