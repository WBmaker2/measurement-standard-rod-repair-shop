export const tutorial = {
  id: "tutorial-equal-unit-tiles",
  title: "안내 활동: 같은 칸을 이어 재어요",
  length: 4,
  message: "선은 5개지만 선 사이의 같은 칸은 4개예요.",
};

export const missionContent = [
  {
    id: "misaligned-zero-start",
    order: 1,
    title: "시작을 0에 맞춰요",
    shortFault: "시작이 0과 달라요",
    hint: "물체 왼쪽 끝과 자의 0이 만났는지 봐요.",
    length: 5,
    brokenReading: 6,
    faults: ["origin-misaligned"],
    repairs: ["align-origin"],
    estimateOptions: [4, 5, 6],
    readingByRepairs: { "": 6, "align-origin": 5 },
    object: "연필 띠",
    faultOptions: ["origin-misaligned", "gap", "overlap"],
    beforeText: "물체 시작이 눈금 1에 있어요. 끝 숫자 6만 읽으면 안 돼요.",
    afterText: "0에 맞추면 같은 칸 5개예요.",
    explanation: "시작을 0에 맞추지 않고 끝 숫자만 읽었어요.",
    teacherNote: "다른 눈금에서 차를 구하는 방법은 다음 학습에서 다룹니다.",
  },
  {
    id: "gapped-unit-tiles",
    order: 2,
    title: "틈을 닫아요",
    shortFault: "칸 사이의 틈",
    hint: "칸 사이에 빈 곳이 있는지 봐요.",
    length: 5,
    brokenReading: 6,
    faults: ["gap"],
    repairs: ["close-gap"],
    estimateOptions: [4, 5, 6],
    readingByRepairs: { "": 6, "close-gap": 5 },
    object: "종이 띠",
    faultOptions: ["gap", "overlap", "unequal-unit"],
    beforeText: "빈 공간 때문에 6cm처럼 읽었어요.",
    afterText: "빈틈 없이 같은 칸 5개가 이어졌어요.",
    explanation: "빈 공간은 단위칸이 아니에요.",
    teacherNote: "틈이면 언제나 1만큼 작다고 일반화하지 않게 합니다.",
  },
  {
    id: "overlapping-unit-tiles",
    order: 3,
    title: "겹침을 풀어요",
    shortFault: "칸이 겹침",
    hint: "두 칸이 같은 곳을 덮는지 봐요.",
    length: 5,
    brokenReading: 6,
    faults: ["overlap"],
    repairs: ["remove-overlap"],
    estimateOptions: [4, 5, 6],
    readingByRepairs: { "": 6, "remove-overlap": 5 },
    object: "나무 막대",
    faultOptions: ["overlap", "gap", "origin-misaligned"],
    beforeText: "한 곳을 두 칸이 함께 덮어 6칸처럼 보였어요.",
    afterText: "겹침을 풀면 같은 칸 5개예요.",
    explanation: "겹친 곳을 두 번 세면 안 돼요.",
    teacherNote: "겹침의 크기에 따라 오류가 달라질 수 있음을 덧붙입니다.",
  },
  {
    id: "unequal-unit-widths",
    order: 4,
    title: "칸을 같은 크기로 맞춰요",
    shortFault: "칸 크기가 다름",
    hint: "칸들이 모두 같은 너비인지 봐요.",
    length: 6,
    brokenReading: 7,
    faults: ["unequal-unit"],
    repairs: ["normalize-units"],
    estimateOptions: [5, 6, 7],
    readingByRepairs: { "": 7, "normalize-units": 6 },
    object: "책갈피 띠",
    faultOptions: ["unequal-unit", "gap", "overlap"],
    beforeText: "작은 칸과 큰 칸이 섞여 7cm처럼 읽었어요.",
    afterText: "같은 크기 칸 6개로 바르게 잴 수 있어요.",
    explanation: "1칸이라 불러도 크기가 달라 7cm로 잘못 읽었어요.",
    teacherNote: "값이 언제나 커지거나 작아진다고 말하지 않습니다.",
  },
  {
    id: "boundary-and-combined-repair",
    order: 5,
    title: "두 고장 함께 찾기",
    shortFault: "겹침과 숫자",
    hint: "겹친 칸과 같은 숫자 두 개를 봐요.",
    length: 7,
    brokenReading: 8,
    faults: ["overlap", "label-sequence"],
    repairs: ["remove-overlap", "restore-labels"],
    estimateOptions: [5, 7, 9],
    readingByRepairs: {
      "": 8,
      "remove-overlap": 7,
      "restore-labels": 8,
      "remove-overlap+restore-labels": 7,
      "restore-labels+remove-overlap": 7,
    },
    object: "색 테이프",
    faultOptions: ["overlap", "label-sequence", "boundary-count"],
    beforeText: "칸 하나가 겹치고 눈금 숫자도 한 번 겹쳐 있어요.",
    afterText: "선은 8개, 선 사이 칸은 7개예요.",
    explanation: "칸의 간격과 눈금 숫자를 고치고, 선 사이 칸을 세었어요.",
    teacherNote: "물체는 그대로이고 기준봉만 정비되었다고 확인합니다.",
  },
];

export const faultLabels = {
  "origin-misaligned": "시작이 0과 맞지 않아요",
  gap: "칸 사이에 틈이 있어요",
  overlap: "칸이 겹쳐 있어요",
  "unequal-unit": "칸 크기가 달라요",
  "label-sequence": "눈금 숫자 차례가 달라요",
  "boundary-count": "선과 칸을 헷갈렸어요",
};

export const faultHints = {
  "origin-misaligned": "물체 왼쪽 끝과 자의 0이 만났는지 봐요.",
  gap: "칸 사이에 빈 곳이 있는지 봐요.",
  overlap: "두 칸이 같은 곳을 덮는지 봐요.",
  "unequal-unit": "칸들이 모두 같은 너비인지 봐요.",
  "label-sequence": "눈금 숫자가 0, 1, 2처럼 차례인지 봐요.",
  "boundary-count": "선이 아니라 선 사이 칸을 하나씩 세어 봐요.",
};

export const repairLabels = {
  "align-origin": "0에 맞추기",
  "close-gap": "틈 닫기",
  "remove-overlap": "겹침 풀기",
  "normalize-units": "같은 크기로 맞추기",
  "restore-labels": "눈금 숫자 고치기",
};

const repairToFault = {
  "align-origin": "origin-misaligned",
  "close-gap": "gap",
  "remove-overlap": "overlap",
  "normalize-units": "unequal-unit",
  "restore-labels": "label-sequence",
};

export function getReadingAfterRepair(mission) {
  return mission.length;
}

export function getReadingForRepairs(mission, repairs = []) {
  const repairOrder = Array.isArray(mission.repairs) ? mission.repairs : [];
  const key = repairOrder.filter((repair) => repairs.includes(repair)).join("+");
  if (Object.prototype.hasOwnProperty.call(mission.readingByRepairs ?? {}, key)) {
    return mission.readingByRepairs[key];
  }
  return repairs.length === repairOrder.length ? mission.length : mission.brokenReading;
}

export function buildRepairRecord(mission, session) {
  return {
    missionId: mission.id,
    title: mission.title,
    estimate: session.estimate,
    faults: mission.faults.map((fault) => faultLabels[fault]),
    repairs: session.repairs.map((repair) => repairLabels[repair]),
    brokenReading: mission.brokenReading,
    currentReading: getReadingForRepairs(mission, session.repairs),
    correctReading: mission.length,
    explanation: mission.explanation,
  };
}

export function getRemainingFaults(mission, repairs) {
  return mission.faults.filter((fault) => !repairs.includes(
    Object.entries(repairToFault).find(([, value]) => value === fault)?.[0],
  ));
}

export function validateMissionContent(missions) {
  const errors = [];
  missions.forEach((mission) => {
    if (!mission.id || !mission.title || !mission.explanation) errors.push(`${mission.id || "미션"}: 설명이 필요해요.`);
    if (!mission.length || !Array.isArray(mission.faults) || !mission.faults.length) errors.push(`${mission.id}: 오류가 필요해요.`);
    if (!Array.isArray(mission.repairs) || mission.repairs.length < mission.faults.length) errors.push(`${mission.id}: 수리 동작이 부족해요.`);
    if (mission.faults.some((fault) => !Object.values(repairToFault).includes(fault))) errors.push(`${mission.id}: 오류에 맞는 수리 동작이 필요해요.`);
    if (mission.repairs.some((repair) => !repairToFault[repair] || !mission.faults.includes(repairToFault[repair]))) errors.push(`${mission.id}: 허용되지 않은 수리 동작이 있어요.`);
    if (getReadingAfterRepair(mission) !== mission.length) errors.push(`${mission.id}: 바른 측정값이 맞지 않아요.`);
    if (!mission.readingByRepairs || getReadingForRepairs(mission, mission.repairs) !== mission.length) errors.push(`${mission.id}: 수리 단계별 측정값이 맞지 않아요.`);
  });
  return errors;
}
