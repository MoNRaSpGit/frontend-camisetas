import { useEffect, useState } from "react";

const STORAGE_KEY = "pdh-logo-size";
const DEFAULT_WIDTH = 192;
const DEFAULT_HEIGHT = 128;

function applySize(width: number, height: number) {
  document.documentElement.style.setProperty("--pdh-logo-w", `${width}px`);
  document.documentElement.style.setProperty("--pdh-logo-h", `${height}px`);
}

export function LogoSizeTuner() {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { width: number; height: number };
        setWidth(parsed.width);
        setHeight(parsed.height);
        applySize(parsed.width, parsed.height);
        return;
      } catch {
        // valor guardado invalido, seguimos con los defaults
      }
    }
    applySize(DEFAULT_WIDTH, DEFAULT_HEIGHT);
  }, []);

  function update(nextWidth: number, nextHeight: number) {
    setWidth(nextWidth);
    setHeight(nextHeight);
    applySize(nextWidth, nextHeight);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ width: nextWidth, height: nextHeight }));
  }

  return (
    <div className="pdh-logo-tuner">
      <span className="pdh-logo-tuner-label">📐 Logo</span>
      <label>
        Ancho
        <input
          type="number"
          min={40}
          max={500}
          value={width}
          onChange={(event) => update(Number(event.target.value) || 0, height)}
        />
      </label>
      <label>
        Alto
        <input
          type="number"
          min={20}
          max={300}
          value={height}
          onChange={(event) => update(width, Number(event.target.value) || 0)}
        />
      </label>
    </div>
  );
}
