"use client";

import { useEffect, useRef } from "react";

type CelebrationOverlayProps = {
  onRestart: () => void;
  onViewRecords: () => void;
};

export function CelebrationOverlay({ onRestart, onViewRecords }: CelebrationOverlayProps) {
  const restartButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLElement>(null);

  useEffect(() => {
    restartButton.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onViewRecords();
      if (event.key !== "Tab") return;
      const focusable = dialog.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onViewRecords]);

  return (
    <div className="celebration-backdrop" role="presentation">
      <section aria-describedby="celebration-description" aria-labelledby="celebration-title" aria-modal="true" className="celebration-card" ref={dialog} role="dialog">
        <div aria-hidden="true" className="confetti confetti-one">✦</div>
        <div aria-hidden="true" className="confetti confetti-two">●</div>
        <div aria-hidden="true" className="confetti confetti-three">◆</div>
        <p className="celebration-kicker">오늘의 정비 완료</p>
        <h2 id="celebration-title">정비 끝!<br />정말 잘했어요 🎉</h2>
        <p id="celebration-description">화면 속 자 5개를 모두 고쳤어요.<br />고장난 곳을 찾고, 바른 길이도 확인했어요.</p>
        <div className="celebration-actions">
          <button className="primary-button gi-pulse" onClick={onRestart} ref={restartButton} type="button">처음 화면으로</button>
          <button className="secondary-button" onClick={onViewRecords} type="button">내 기록 보기</button>
        </div>
      </section>
    </div>
  );
}
