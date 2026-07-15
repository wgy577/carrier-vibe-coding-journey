"use client";

import { useCallback, useState } from "react";
import { CarrierDemo } from "../components/CarrierDemo";
import type { LaunchState } from "../lib/launch-machine.mjs";

const LABELS: Record<LaunchState, string> = {
  loading: "场景加载中",
  ready: "准备就绪",
  preparing: "发动机准备",
  launching: "弹射加速",
  climbing: "离舰爬升",
  finished: "演示完成",
};

export default function Home() {
  const [status, setStatus] = useState<LaunchState>("loading");
  const [resetToken, setResetToken] = useState(0);

  const handleLoaded = useCallback(() => {
    setStatus((current) => current === "loading" ? "ready" : current);
  }, []);

  const handleAction = () => {
    if (status === "ready") setStatus("preparing");
    if (status === "finished") {
      setResetToken((token) => token + 1);
      setStatus("ready");
    }
  };

  const running = status === "preparing" || status === "launching" || status === "climbing";
  const buttonText = status === "finished" ? "重新演示" : running ? LABELS[status] : "出动";

  return (
    <main className="demo-shell">
      <CarrierDemo status={status} onStatusChange={setStatus} onLoaded={handleLoaded} resetToken={resetToken} />
      <header className="topbar">
        <div>
          <p className="kicker">CARRIER LAUNCH · 3D DEMO</p>
          <h1>舰载机出动演示</h1>
        </div>
        <div className={`state state-${status}`}><i />{LABELS[status]}</div>
      </header>
      <div className="instructions">拖动旋转 · 滚轮缩放 · 右键平移</div>
      <button className="sortie-button" disabled={status === "loading" || running} onClick={handleAction}>
        <span>{status === "ready" ? "▶" : status === "finished" ? "↺" : "·"}</span>{buttonText}
      </button>
      <div className="corner-line" aria-hidden="true" />
    </main>
  );
}
