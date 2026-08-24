import { useCallback, useEffect, useRef } from "react";
import { setJoystick } from "@/game/input";

const MAX_DRAG = 54;

export function VirtualJoystick() {
  const pointerId = useRef<number | null>(null);
  const origin = useRef<{ x: number; y: number } | null>(null);

  const release = useCallback(() => {
    pointerId.current = null;
    origin.current = null;
    setJoystick(0, 0);
  }, []);

  useEffect(() => release, [release]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Only capture primary touch/click and avoid UI buttons
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    pointerId.current = e.pointerId;
    origin.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== e.pointerId || !origin.current) return;
    let dx = e.clientX - origin.current.x;
    let dy = e.clientY - origin.current.y;
    const dist = Math.hypot(dx, dy);

    if (dist > MAX_DRAG) {
      dx = (dx / dist) * MAX_DRAG;
      dy = (dy / dist) * MAX_DRAG;
    }

    setJoystick(dx / MAX_DRAG, dy / MAX_DRAG);
  }, []);

  return (
    <div
      className="absolute inset-0 z-10 select-none touch-none"
      style={{ touchAction: "none" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={release}
      onPointerCancel={release}
    />
  );
}
