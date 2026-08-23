import { useCallback, useEffect, useRef, useState } from "react";
import { setJoystick } from "@/game/input";

const SIZE = 128;
const KNOB = 52;
const MAX = 44;

export function VirtualJoystick() {
  const baseRef = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const pointerId = useRef<number | null>(null);

  const release = useCallback(() => {
    pointerId.current = null;
    setKnob({ x: 0, y: 0 });
    setJoystick(0, 0);
  }, []);

  useEffect(() => release, [release]);

  const moveTo = useCallback((clientX: number, clientY: number) => {
    const el = baseRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const mag = Math.hypot(dx, dy);
    if (mag > MAX) {
      dx = (dx / mag) * MAX;
      dy = (dy / mag) * MAX;
    }
    setKnob({ x: dx, y: dy });
    setJoystick(dx / MAX, dy / MAX);
  }, []);

  return (
    <div
      ref={baseRef}
      className="relative h-32 w-32 rounded-full border-2 border-cream/40 bg-ink/35 shadow-[inset_0_0_24px_rgba(28,22,18,0.35)]"
      style={{ touchAction: "none" }}
      onPointerDown={(event) => {
        event.preventDefault();
        pointerId.current = event.pointerId;
        event.currentTarget.setPointerCapture(event.pointerId);
        moveTo(event.clientX, event.clientY);
      }}
      onPointerMove={(event) => {
        if (pointerId.current !== event.pointerId) return;
        moveTo(event.clientX, event.clientY);
      }}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <div
        className="absolute left-1/2 top-1/2 rounded-full bg-cream/90 shadow-md"
        style={{
          width: KNOB,
          height: KNOB,
          transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))`,
        }}
      />
    </div>
  );
}

void SIZE;
