// Pure decision helpers for SectionRail. Kept out of the component file so the
// branching logic stays small and testable, and react-refresh stays happy.

// Release pointer capture if we still hold it — belt and braces against
// browsers that report hasPointerCapture=false while still holding it.
export function releasePointerCaptureSafely(list: HTMLElement | null, pointerId: number | null) {
  if (!list || pointerId === null) return;
  try {
    if (list.hasPointerCapture?.(pointerId)) list.releasePointerCapture(pointerId);
  } catch {
    /* already released */
  }
}

// How a scrub ended. `endType` mirrors PointerEvent.type semantics; `clientY`
// is null when the global safety net triggered (no pointer coordinates).
export interface ScrubEnd {
  endType: string;
  clientY: number | null;
}

// A non-drag release with real coordinates is a click/tap on the rail.
// Returns the release y for such a tap, or null when there is nothing to
// resolve ("pointercancel" skips click/tap resolution).
export function tapReleaseY(end: ScrubEnd): number | null {
  return end.endType !== "pointercancel" ? end.clientY : null;
}

export function shouldCoastAfterRelease(isTouch: boolean, end: ScrubEnd): boolean {
  return isTouch && end.endType !== "pointercancel";
}

// One batched read of everything a rail frame needs, so the write pass never
// interleaves reads and writes.
export interface RailFrame {
  y: number;
  progress: number;
  activeEl: HTMLAnchorElement | null | undefined;
}

const isAtScrollEdge = (y: number, docMax: number) => y === 0 || y === docMax;

// Stop at edges or when velocity is negligible.
export function inertiaSettled(velocity: number, nextY: number, docMax: number): boolean {
  return Math.abs(velocity) < 0.02 || isAtScrollEdge(nextY, docMax);
}

export function shouldActivateHash(id: string, navIds: ReadonlySet<string>, activeId: string) {
  if (!id) return false;
  if (!navIds.has(id)) return false;
  return id !== activeId;
}

export function railProgress(y: number, docMax: number): number {
  return docMax > 0 ? Math.min(1, Math.max(0, y / docMax)) : 0;
}

export function progressChanged(p: number, lastProgress: number): boolean {
  return Math.abs(p - lastProgress) > 0.002;
}
