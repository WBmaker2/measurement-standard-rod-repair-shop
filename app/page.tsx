"use client";

import { useMemo, useState } from "react";
import { Modal } from "./components/Modal";
import { RulerDiagram } from "./components/RulerDiagram";
import {
  buildRepairRecord,
  faultLabels,
  getRemainingFaults,
  missionContent,
  repairLabels,
  tutorial,
} from "./lib/mission-data.mjs";

type Stage = "estimate" | "inspect" | "repair" | "count" | "measure" | "explain" | "complete";
type Session = {
  missionIndex: number;
  stage: Stage;
  estimate?: number;
  repairs: string[];
  counted?: number;
  explanation?: string;
};
type RepairRecord = ReturnType<typeof buildRepairRecord>;
type Snapshot = { session: Session; records: RepairRecord[] };

const initialSession: Session = { missionIndex: 0, stage: "estimate", repairs: [] };
const stageNames: Record<Exclude<Stage, "complete">, string> = {
  estimate: "1. 어림", inspect: "2. 고장 찾기", repair: "3. 수리", count: "4. 다시 세기", measure: "5. 값 확인", explain: "6. 이유",
};

export default function Home() {
  const [tutorialStarted, setTutorialStarted] = useState(false);
  const [tutorialDone, setTutorialDone] = useState(false);
  const [session, setSession] = useState<Session>(initialSession);
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [records, setRecords] = useState<RepairRecord[]>([]);
  const [notice, setNotice] = useState("먼저 화면의 칸이 모형이라는 약속을 확인해요.");
  const [modal, setModal] = useState<"meter" | "teacher" | "updates" | "reset" | null>(null);

  const mission = missionContent[session.missionIndex];
  const remainingFaults = useMemo(() => getRemainingFaults(mission, session.repairs), [mission, session.repairs]);
  const complete = session.stage === "complete";

  const move = (next: Session, message: string, record?: RepairRecord) => {
    setHistory((items) => [...items, { session, records }]);
    setSession(next);
    if (record) setRecords((items) => [...items, record]);
    setNotice(message);
  };

  const chooseEstimate = (value: number) => move({ ...session, estimate: value, stage: "inspect" }, `${value} 모형 cm라고 어림했어요. 이제 기준봉을 살펴봐요.`);
  const chooseFault = (fault: string) => {
    if (remainingFaults.includes(fault)) {
      move({ ...session, stage: "repair" }, `${faultLabels[fault]} 찾았어요. 알맞은 수리 버튼을 눌러요.`);
    } else setNotice("다시 살펴볼 곳: 0, 칸의 크기, 틈과 겹침을 차례로 봐요.");
  };
  const repair = (action: string) => {
    if (!mission.repairs.includes(action) || session.repairs.includes(action)) return;
    const repairs = [...session.repairs, action];
    const stillBroken = getRemainingFaults(mission, repairs);
    move({ ...session, repairs, stage: stillBroken.length ? "repair" : "count" }, stillBroken.length ? `수리했어요. 아직 ${stillBroken.length}곳을 더 살펴봐요.` : "정비가 끝났어요. 이번에는 선 사이의 칸을 세어요.");
  };
  const chooseCount = (value: number) => {
    if (value === mission.length) move({ ...session, counted: value, stage: "measure" }, `맞아요. 선 사이의 같은 칸은 ${value}개예요.`);
    else setNotice("눈금선이 아니라, 물체가 차지한 선 사이의 칸을 하나씩 세어 봐요.");
  };
  const chooseReason = (value: string) => {
    if (value === mission.explanation) move(
      { ...session, explanation: value, stage: "complete" },
      "정비 기록에 이 미션을 남겼어요.",
      buildRepairRecord(mission, session),
    );
    else setNotice("수리 전과 후에 기준봉에서 무엇이 달라졌는지 다시 살펴봐요.");
  };
  const nextMission = () => {
    if (session.missionIndex === missionContent.length - 1) {
      setNotice("다섯 가지 정비 기록을 모두 만들었어요.");
      requestAnimationFrame(() => document.getElementById("record-title")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
    else move({ missionIndex: session.missionIndex + 1, stage: "estimate", repairs: [] }, "새 기준봉이에요. 물체 길이부터 어림해요.");
  };
  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setSession(previous.session);
    setRecords(previous.records);
    setHistory((items) => items.slice(0, -1));
    setNotice("바로 전 단계로 돌아왔어요. 뒤의 선택은 다시 해요.");
  };
  const reset = () => {
    setTutorialStarted(false); setTutorialDone(false); setSession(initialSession); setHistory([]); setRecords([]); setModal(null); setNotice("처음부터 다시 시작해요. 먼저 모형 안내를 확인해요.");
  };

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="#workbench"><span aria-hidden="true">▰</span> 측정 기준봉 정비소</a>
        <div className="header-actions">
          <button className="text-button" onClick={() => setModal("meter")} type="button">1m 카드</button>
          <button className="text-button" onClick={() => setModal("teacher")} type="button">교사용 안내</button>
          <button className="text-button" onClick={() => setModal("updates")} type="button">업데이트 내역</button>
        </div>
      </header>

      {!tutorialDone ? (
        <section className="welcome" aria-labelledby="welcome-title">
          <div>
            <p className="wood-label">오늘의 작업대</p>
            <h1 id="welcome-title">고장난 기준봉을<br />바르게 고쳐요.</h1>
            <p className="lead">물체는 그대로예요. 시작점과 같은 크기의 칸을 살펴보고, 다시 바르게 재어 봐요.</p>
            <p className="model-note">화면의 칸은 <strong>1cm를 나타내는 모형</strong>이에요. 화면에서 실제 1cm 크기는 아니에요.</p>
            <button className="primary-button" onClick={() => { setTutorialStarted(true); setNotice("안내 활동이에요. 눈금선 말고 선 사이의 칸을 세어 봐요."); }} type="button">안내 활동 시작하기</button>
          </div>
          <aside className="tutorial-card">
            <p>안내 활동</p><h2>{tutorial.title}</h2>
            <RulerDiagram broken={false} length={tutorial.length} missionId={tutorial.id} repaired />
            <strong>{tutorial.message}</strong>
            {tutorialStarted ? <ChoiceGroup label="선 사이의 같은 칸은 몇 개인가요?" optionSuffix="개" options={["3", "4", "5"]} onChoose={(value) => {
              if (Number(value) === tutorial.length) { setTutorialDone(true); setNotice("같은 칸 4개를 확인했어요. 첫 정비를 시작해요."); }
              else setNotice("눈금선이 아니라, 선과 선 사이의 칸을 세어 봐요.");
            }} /> : <p className="tutorial-prompt">시작하기를 누른 뒤, 선 사이의 칸을 직접 골라요.</p>}
            <p aria-live="polite" className="tutorial-notice">{tutorialStarted ? notice : ""}</p>
          </aside>
        </section>
      ) : (
        <section className="learning-area" id="workbench">
          <div className="mission-topline"><span>정비 {mission.order} / 5</span><span>{complete ? "기록 완료" : stageNames[session.stage as Exclude<Stage, "complete">]}</span></div>
          <div className="progress" aria-label={`정비 ${mission.order} / 5`}><span style={{ width: `${(mission.order / 5) * 100}%` }} /></div>
          <div className="work-grid">
            <section className="instruction-panel" aria-labelledby="mission-title">
              <p className="wood-label">{mission.shortFault}</p>
              <h1 id="mission-title">{mission.title}</h1>
              <p className="task-copy">{stageInstruction(session.stage, mission.length, remainingFaults.length)}</p>
              <div className="status-note" aria-live="polite">{notice}</div>
              {session.stage === "estimate" && <ChoiceGroup label="몇 모형 cm일까요?" optionSuffix="모형 cm" options={mission.estimateOptions.map(String)} onChoose={(value) => chooseEstimate(Number(value))} />}
              {session.stage === "inspect" && <ChoiceGroup label="무엇이 고장났나요?" options={mission.faultOptions} labelFor={(item) => faultLabels[item]} onChoose={chooseFault} />}
              {session.stage === "repair" && <RepairTools mission={mission} repairs={session.repairs} onRepair={repair} />}
              {session.stage === "count" && <ChoiceGroup label="선 사이의 칸은 몇 개인가요?" optionSuffix="개" options={[mission.length - 1, mission.length, mission.length + 1].map(String)} onChoose={(value) => chooseCount(Number(value))} />}
              {session.stage === "measure" && <button className="primary-button" onClick={() => move({ ...session, stage: "explain" }, `바른 측정값은 ${mission.length} 모형 cm예요. 왜 달라졌는지 골라요.`)} type="button">바른 값 확인하기</button>}
              {session.stage === "explain" && <ChoiceGroup label="왜 값이 달라졌나요?" options={[mission.explanation, "물체가 저절로 길어졌어요.", "화면의 칸이 실제 자가 되었어요."]} onChoose={chooseReason} />}
              {complete && <div className="completion"><strong>정비 기록 완성!</strong><p>{mission.explanation}</p><button className="primary-button" onClick={nextMission} type="button">{mission.order === 5 ? "정비 기록 보기" : "다음 기준봉 정비하기"}</button></div>}
              <div className="utility-actions"><button disabled={!history.length} onClick={undo} type="button">한 단계 되돌리기</button><button onClick={() => setModal("reset")} type="button">처음부터 다시 하기</button></div>
            </section>
            <section className="bench" aria-label="측정 기준봉 작업대">
              <div className="bench-heading"><span>작업대</span><span className="model-badge">1cm 모형칸</span></div>
              <p className="object-name">{mission.object}의 길이를 재고 있어요.</p>
              <RulerDiagram broken={session.stage !== "count" && session.stage !== "measure" && session.stage !== "explain" && !complete} length={mission.length} missionId={mission.id} repaired={!remainingFaults.length} />
              <div className="comparison" aria-label="정비 전후 비교"><div><span>정비 전 표시</span><strong>{mission.brokenReading === null ? "믿기 어려움" : `${mission.brokenReading} 모형 cm`}</strong></div><div><span>바른 측정</span><strong>{session.stage === "measure" || session.stage === "explain" || complete ? `${mission.length} 모형 cm` : "수리 뒤 확인"}</strong></div></div>
            </section>
          </div>
          {session.missionIndex === missionContent.length - 1 && complete && <RecordList records={records} />}
        </section>
      )}
      {modal === "meter" && <MeterModal onClose={() => setModal(null)} />}
      {modal === "teacher" && <TeacherModal onClose={() => setModal(null)} />}
      {modal === "updates" && <UpdatesModal onClose={() => setModal(null)} />}
      {modal === "reset" && <Modal onClose={() => setModal(null)} title="처음부터 다시 할까요?"><p>지금까지 화면에서 만든 선택과 정비 기록이 사라져요.</p><div className="modal-actions"><button className="secondary-button" onClick={() => setModal(null)} type="button">계속하기</button><button className="primary-button" onClick={reset} type="button">처음부터 하기</button></div></Modal>}
    </main>
  );
}

function stageInstruction(stage: Stage, length: number, remaining: number) {
  if (stage === "estimate") return "먼저 길이를 어림해요. 정답이 아니어도 괜찮아요.";
  if (stage === "inspect") return "기준봉의 0과 칸을 차례로 살펴봐요.";
  if (stage === "repair") return remaining > 1 ? "남은 고장을 차례로 고쳐요." : "알맞은 도구로 기준봉을 고쳐요.";
  if (stage === "count") return "눈금선이 아니라, 선 사이 칸을 세어요.";
  if (stage === "measure") return `같은 크기의 칸 ${length}개가 이어졌어요.`;
  if (stage === "explain") return "물체가 아니라 기준봉에서 달라진 것을 골라요.";
  return "정비를 마쳤어요.";
}

function ChoiceGroup({ label, options, labelFor, onChoose, optionSuffix }: { label: string; options: string[]; labelFor?: (item: string) => string; onChoose: (value: string) => void; optionSuffix?: string }) {
  return <fieldset className="choice-group"><legend>{label}</legend><div>{options.map((option) => <button key={option} onClick={() => onChoose(option)} type="button">{labelFor ? labelFor(option) : optionSuffix ? `${option} ${optionSuffix}` : option}</button>)}</div></fieldset>;
}

function RepairTools({ mission, repairs, onRepair }: { mission: typeof missionContent[number]; repairs: string[]; onRepair: (action: string) => void }) {
  return <div className="repair-tools"><p>정비 도구를 골라요.</p>{mission.repairs.map((action) => <button className="primary-button" disabled={repairs.includes(action)} key={action} onClick={() => onRepair(action)} type="button">{repairs.includes(action) ? "수리했어요" : repairLabels[action]}</button>)}</div>;
}

function RecordList({ records }: { records: RepairRecord[] }) {
  return <section className="record-list" aria-labelledby="record-title"><h2 id="record-title" tabIndex={-1}>측정 정비 기록</h2><p>점수 대신, 내가 어림하고 무엇을 고쳤는지 남겼어요.</p>{records.map((record, index) => <article key={record.missionId}><strong>{index + 1}. {record.title}</strong><span>어림 {record.estimate} 모형 cm · 고장 {record.faults.join(", ")} · 수리 {record.repairs.join(", ")} · 정비 전 {record.brokenReading === null ? "믿기 어려움" : `${record.brokenReading} 모형 cm`} · 바른 측정 {record.correctReading} 모형 cm · 이유 {record.explanation}</span></article>)}</section>;
}

function MeterModal({ onClose }: { onClose: () => void }) {
  return <Modal onClose={onClose} title="1m와 100cm 관계"><p className="model-note">이 막대도 실제 1m 길이가 아니라 관계를 보여 주는 모형이에요.</p><div className="meter-blocks">{Array.from({ length: 10 }, (_, index) => <span key={index}>{index + 1}<small>10cm</small></span>)}</div><p><strong>1m = 10cm 묶음 10개 = 100cm</strong></p></Modal>;
}
function TeacherModal({ onClose }: { onClose: () => void }) {
  return <Modal onClose={onClose} title="교사용 안내"><ul><li>이 앱은 실제 자 사용을 대신하지 않습니다.</li><li>학생에게 화면에 물건을 대어 재지 않도록 알려 주세요.</li><li>0 맞추기는 초보 측정의 기본 절차입니다.</li><li>정답 속도보다 고장 이유를 말하는지 관찰해 주세요.</li></ul></Modal>;
}
function UpdatesModal({ onClose }: { onClose: () => void }) {
  return <Modal onClose={onClose} title="업데이트 내역"><article className="update-entry"><strong>2026-07-17 · v1.0.1</strong><p>다섯 단계 안내, 한 단계 되돌리기, 비교표와 작은 화면 조작을 더했어요.</p></article><article className="update-entry"><strong>2026-07-17 · v1.0.0</strong><p>시작점, 틈, 겹침, 같은 단위, 눈금 사이 세기 미션 5개를 만들었어요.</p></article></Modal>;
}
