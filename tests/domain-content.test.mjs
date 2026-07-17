import assert from "node:assert/strict";
import test from "node:test";

import {
  buildRepairRecord,
  getReadingAfterRepair,
  getRemainingFaults,
  missionContent,
  validateMissionContent,
} from "../app/lib/mission-data.mjs";

test("고정 미션은 다섯 가지 측정 오류와 마지막 복합 오류를 담는다", () => {
  assert.equal(missionContent.length, 5);
  assert.deepEqual(
    missionContent.map((mission) => mission.id),
    [
      "misaligned-zero-start",
      "gapped-unit-tiles",
      "overlapping-unit-tiles",
      "unequal-unit-widths",
      "boundary-and-combined-repair",
    ],
  );
  assert.deepEqual(missionContent.at(-1).faults, ["overlap", "label-sequence"]);
});

test("수리 뒤 값은 물체 길이와 같고, 고장 값은 각 고정 사례와 맞는다", () => {
  const gap = missionContent.find((mission) => mission.id === "gapped-unit-tiles");
  const overlap = missionContent.find((mission) => mission.id === "overlapping-unit-tiles");

  assert.equal(gap.brokenReading, 4);
  assert.equal(getReadingAfterRepair(gap), 5);
  assert.equal(overlap.brokenReading, 6);
  assert.equal(getReadingAfterRepair(overlap), 5);
  assert.ok(missionContent.every((mission) => getReadingAfterRepair(mission) === mission.length));
});

test("허용한 수리만 오류를 없애며, 마지막 미션은 두 번 수리해야 한다", () => {
  const finalMission = missionContent.at(-1);
  assert.deepEqual(getRemainingFaults(finalMission, []), ["overlap", "label-sequence"]);
  assert.deepEqual(getRemainingFaults(finalMission, ["remove-overlap"]), ["label-sequence"]);
  assert.deepEqual(
    getRemainingFaults(finalMission, ["remove-overlap", "restore-labels"]),
    [],
  );
});

test("콘텐츠 검사는 설명과 수리 정보를 빠뜨린 미션을 거절한다", () => {
  assert.deepEqual(validateMissionContent(missionContent), []);
  assert.match(
    validateMissionContent([{ ...missionContent[0], repairs: [] }]).join(" "),
    /수리/,
  );
  assert.match(
    validateMissionContent([{ ...missionContent[0], faults: ["boundary-count"] }]).join(" "),
    /오류에 맞는 수리/,
  );
});

test("정비 기록은 학생의 어림과 수리, 전후 측정값, 이유를 함께 보존한다", () => {
  const mission = missionContent[0];
  assert.deepEqual(
    buildRepairRecord(mission, { estimate: 6, repairs: ["align-origin"] }),
    {
      missionId: "misaligned-zero-start",
      title: "출발점을 맞춰요",
      estimate: 6,
      faults: ["물체 한 끝과 0이 맞지 않아요"],
      repairs: ["0에 맞추기"],
      brokenReading: 6,
      correctReading: 5,
      explanation: "시작을 0에 맞추지 않고 끝 숫자만 읽었어요.",
    },
  );
});
