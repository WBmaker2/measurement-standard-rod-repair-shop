"use client";

import { useEffect, useRef } from "react";

type CelebrationOverlayProps = {
  onRestart: () => void;
  onViewRecords: () => void;
};

export function CelebrationOverlay({ onRestart, onViewRecords }: CelebrationOverlayProps) {
  const restartButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    restartButton.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onViewRecords();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onViewRecords]);

  return (
    <div className="celebration-backdrop" role="presentation">
      <section aria-labelledby="celebration-title" aria-modal="true" className="celebration-card" role="dialog">
        <div aria-hidden="true" className="confetti confetti-one">✦</div>
        <div aria-hidden="true" className="confetti confetti-two">●</div>
        <div aria-hidden="true" className="confetti confetti-three">◆</div>
        <p className="celebration-kicker">오늘의 정비 완료</p>
        <h2 id="celebration-title">정비 끝!<br />정말 잘했어요 🎉</h2>
        <p>화면 속 자 5개를 모두 고쳤어요.<br />고장난 곳을 찾고, 바른 길이도 확인했어요.</p>
        <div className="celebration-actions">
          <button className="primary-button gi-pulse" onClick={onRestart} ref={restartButton} type="button">처음 화면으로</button>
          <button className="secondary-button" onClick={onViewRecords} type="button">내 기록 보기</button>
        </div>
      </section>
    </div>
  );
}
