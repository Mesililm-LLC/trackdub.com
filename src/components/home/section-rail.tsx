import { useEffect, useRef, useState } from "react";
import { NAV, now, setLocationHash } from "@/components/home/helpers";

export function SectionRail() {
  const [active, setActive] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const itemsRef = useRef<Record<string, HTMLAnchorElement | null>>({});
  const listRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const navIds = useRef(new Set(NAV.map((n) => n.href.slice(1))));
  const activeRef = useRef<string>("");
  const [scrubbing, setScrubbing] = useState(false);
  // Direct DOM refs so scroll/pointer frames write straight to style,
  // bypassing React re-renders and the reconciler.
  const progressFillRef = useRef<HTMLSpanElement | null>(null);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const dragStartYRef = useRef(0);
  const draggingRef = useRef(false);
  const suppressClickRef = useRef(false);
  const scrubRafRef = useRef<number | null>(null);
  const pendingScrubYRef = useRef<number | null>(null);
  // Track the active pointer id so global safety-net listeners (window
  // pointercancel, blur, visibilitychange) can force-release capture even
  // if the element-scoped pointerup/cancel never fires — e.g. the OS
  // hijacks the gesture, the tab is backgrounded mid-drag, or a modal
  // steals focus. Without this the drag stays "captured" forever and the
  // rail desyncs from real scroll position on the next interaction.
  const activePointerIdRef = useRef<number | null>(null);
  // Velocity tracking for touch inertia. We keep a short ring buffer of
  // recent pointer samples so release velocity reflects the last ~80ms of
  // motion, not the whole gesture — feels natural on touchscreens.
  const scrubSamplesRef = useRef<Array<{ y: number; t: number }>>([]);
  const pointerTypeRef = useRef<string>("mouse");
  const inertiaRafRef = useRef<number | null>(null);
  // Custom smooth-scroll animation state so we can retarget or interrupt
  // mid-flight (native window.scrollTo({behavior:'smooth'}) can't be cancelled
  // or re-aimed without racing the browser).
  const smoothRafRef = useRef<number | null>(null);
  const smoothTargetRef = useRef<number | null>(null);
  const smoothStartRef = useRef<{ y: number; t: number } | null>(null);
  const smoothDurRef = useRef(560);

  // Single centralized rail-frame scheduler. All DOM writes for the rail
  // (progress fill scaleY, active indicator translateY/height, aria-valuenow,
  // visibility toggle) go through one ordered pass so scroll, resize,
  // active-change, and pointer scrubs never race or double-write.
  const scheduleRailFrameRef = useRef<() => void>(() => {});

  const prefersReducedMotion = () =>
    typeof document !== "undefined" &&
    (document.documentElement.classList.contains("reduce-motion") ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

  const cancelSmoothScroll = () => {
    if (smoothRafRef.current !== null) {
      window.cancelAnimationFrame(smoothRafRef.current);
      smoothRafRef.current = null;
    }
    smoothTargetRef.current = null;
    smoothStartRef.current = null;
  };

  const cancelInertia = () => {
    if (inertiaRafRef.current !== null) {
      window.cancelAnimationFrame(inertiaRafRef.current);
      inertiaRafRef.current = null;
    }
  };

  const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

  const animateScrollTo = (targetY: number) => {
    const docMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const clamped = Math.min(docMax, Math.max(0, targetY));
    // If a scroll is in flight, retarget it: keep the current position as the
    // new start and restart the clock so easing stays continuous.
    smoothTargetRef.current = clamped;
    const startedAt = now();
    const distance = Math.abs(clamped - window.scrollY);
    // Scale duration modestly with distance, capped for snappiness.
    smoothDurRef.current = Math.min(280, Math.max(140, 120 + distance * 0.08));
    smoothStartRef.current = { y: window.scrollY, t: startedAt };
    if (smoothRafRef.current !== null) return; // loop already running
    const step = () => {
      const start = smoothStartRef.current;
      const target = smoothTargetRef.current;
      if (start === null || target === null) {
        smoothRafRef.current = null;
        return;
      }
      const elapsed = now() - start.t;
      const p = Math.min(1, elapsed / smoothDurRef.current);
      const y = start.y + (target - start.y) * easeOutExpo(p);
      window.scrollTo(0, y);
      if (p < 1) {
        smoothRafRef.current = window.requestAnimationFrame(step);
      } else {
        smoothRafRef.current = null;
        smoothTargetRef.current = null;
        smoothStartRef.current = null;
      }
    };
    smoothRafRef.current = window.requestAnimationFrame(step);
  };

  const scrollToTargetId = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY;
    if (prefersReducedMotion()) {
      cancelSmoothScroll();
      window.scrollTo({ top, behavior: "auto" });
      return;
    }
    animateScrollTo(top);
  };

  const applyScrubFromClientY = (clientY: number) => {
    const list = listRef.current;
    if (!list) return;
    const box = list.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (clientY - box.top) / Math.max(1, box.height)));
    const docMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    // Scrubbing takes over from any in-flight smooth scroll.
    cancelSmoothScroll();
    window.scrollTo({ top: f * docMax, behavior: "auto" });
    // Nudge the centralized rail scheduler so progress/indicator update on
    // the same frame as the scroll write — don't wait for scroll event.
    scheduleRailFrameRef.current();
  };

  // Resolve a pointer y to the nearest chapter anchor. Powers "click anywhere
  // on the rail" — clicks that don't land exactly on an anchor still jump to
  // the closest chapter instead of doing nothing.
  const nearestChapterId = (clientY: number): string | null => {
    let bestId: string | null = null;
    let bestDist = Infinity;
    for (const [id, el] of Object.entries(itemsRef.current)) {
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const d = Math.abs(clientY - center);
      if (d < bestDist) {
        bestDist = d;
        bestId = id;
      }
    }
    return bestId;
  };

  const jumpToChapter = (id: string) => {
    const href = `#${id}`;
    if (window.history?.pushState) {
      window.history.pushState(null, "", href);
      setActive(id);
    } else {
      setLocationHash(href);
    }
    scrollToTargetId(id);
  };

  // Convert a pointer sample into document scroll position, but only push
  // samples for velocity — the actual scroll happens via applyScrubFromClientY.
  const pushSample = (clientY: number) => {
    const list = listRef.current;
    if (!list) return;
    const box = list.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (clientY - box.top) / Math.max(1, box.height)));
    const docMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const y = f * docMax;
    const sampledAt = now();
    const buf = scrubSamplesRef.current;
    buf.push({ y, t: sampledAt });
    // Keep only the last ~120ms of samples.
    while (buf.length > 2 && sampledAt - buf[0].t > 120) buf.shift();
  };

  const releaseVelocity = () => {
    const buf = scrubSamplesRef.current;
    if (buf.length < 2) return 0;
    const first = buf[0];
    const last = buf[buf.length - 1];
    const dt = Math.max(1, last.t - first.t);
    return (last.y - first.y) / dt; // px per ms in document space
  };

  const startInertia = (v0: number) => {
    // Ignore trivial flicks so a slow drag doesn't drift after release.
    if (Math.abs(v0) < 0.35) return;
    cancelInertia();
    cancelSmoothScroll();
    let v = v0;
    let last = now();
    // Exponential decay — friction tuned so a hard fling settles in ~600ms.
    const decayPerMs = 0.995;
    const step = () => {
      const nowT = now();
      const dt = nowT - last;
      last = nowT;
      const docMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const nextY = Math.min(docMax, Math.max(0, window.scrollY + v * dt));
      window.scrollTo(0, nextY);
      v *= Math.pow(decayPerMs, dt);
      // Stop at edges or when velocity is negligible.
      if (Math.abs(v) < 0.02 || nextY === 0 || nextY === docMax) {
        inertiaRafRef.current = null;
        return;
      }
      inertiaRafRef.current = window.requestAnimationFrame(step);
    };
    inertiaRafRef.current = window.requestAnimationFrame(step);
  };

  const scheduleScrub = (clientY: number) => {
    pendingScrubYRef.current = clientY;
    if (scrubRafRef.current !== null) return;
    scrubRafRef.current = window.requestAnimationFrame(() => {
      scrubRafRef.current = null;
      const y = pendingScrubYRef.current;
      pendingScrubYRef.current = null;
      if (y !== null) applyScrubFromClientY(y);
    });
  };
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Cancel any in-flight smooth scroll the moment the user takes over with
  // the wheel, touch, or keyboard — the animation should never fight input.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const cancel = () => {
      cancelSmoothScroll();
      cancelInertia();
    };
    const onKey = (e: KeyboardEvent) => {
      // Only cancel for keys that actually scroll.
      const scrollKeys = new Set([
        "PageUp",
        "PageDown",
        "Home",
        "End",
        "ArrowUp",
        "ArrowDown",
        " ",
        "Spacebar",
      ]);
      if (scrollKeys.has(e.key)) cancel();
    };
    // All three are read-only w.r.t. the event (never preventDefault) — mark
    // passive so the browser can start scrolling without waiting on this JS.
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });
    window.addEventListener("keydown", onKey, { passive: true });
    return () => {
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("keydown", onKey);
      cancelSmoothScroll();
      cancelInertia();
    };
  }, []);

  // Sync with URL hash — deep links should highlight the right chapter.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncFromHash = () => {
      const id = window.location.hash.slice(1);
      if (id && navIds.current.has(id) && id !== activeRef.current) {
        setActive(id);
      }
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ids = NAV.map((n) => n.href.slice(1));
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;

    // Track intersection ratios in a map so the "most visible" pick is O(n)
    // over sections, not a resort of every entry batch.
    const ratios = new Map<string, number>();
    targets.forEach((t) => ratios.set(t.id, 0));
    let currentActive = "";

    const pickActive = () => {
      let bestId = currentActive;
      let bestRatio = -1;
      ratios.forEach((r, id) => {
        if (r > bestRatio) {
          bestRatio = r;
          bestId = id;
        }
      });
      if (bestRatio > 0 && bestId !== currentActive) {
        currentActive = bestId;
        setActive(bestId);
      }
    };

    // Coalesce IO callbacks + pickActive into a single rAF so a burst of
    // entries during fast scrolls schedules exactly one setState.
    let pickScheduled = false;
    const schedulePick = () => {
      if (pickScheduled) return;
      pickScheduled = true;
      window.requestAnimationFrame(() => {
        pickScheduled = false;
        pickActive();
      });
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        }
        schedulePick();
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    targets.forEach((t) => io.observe(t));

    // Cache scroll extent — recompute only when layout actually changes,
    // not inside the scroll handler (avoids forced reflow every frame).
    let docMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    let lastVisible = false;
    let lastProgress = -1;
    let lastAria = -1;
    let lastIndTop = Number.NaN;
    let lastIndHeight = Number.NaN;
    let rafId: number | null = null;
    let ticking = false;

    // Strict-ordered, redundant-write-free write pass. Reads first, then
    // writes in a fixed order: visibility → progress fill → aria-valuenow →
    // indicator geometry. Each property gates on a "changed enough" check
    // so we never touch style or attributes when nothing moved.
    const writeRailFrame = () => {
      ticking = false;
      rafId = null;

      // 1) Reads (batched — no interleaved writes → no layout thrash)
      const y = window.scrollY;
      const p = docMax > 0 ? Math.min(1, Math.max(0, y / docMax)) : 0;
      const activeEl = itemsRef.current[activeRef.current];

      // 2) Visibility
      const nextVisible = y > 480;
      if (nextVisible !== lastVisible) {
        lastVisible = nextVisible;
        setVisible(nextVisible);
      }

      // 3) Progress fill
      if (Math.abs(p - lastProgress) > 0.002) {
        lastProgress = p;
        const fill = progressFillRef.current;
        if (fill) fill.style.transform = `scaleY(${p})`;
      }

      // 4) aria-valuenow — only when the rounded value flips
      const ariaVal = Math.round(p * 100);
      if (ariaVal !== lastAria) {
        lastAria = ariaVal;
        const list = listRef.current;
        if (list) list.setAttribute("aria-valuenow", String(ariaVal));
      }

      // 5) Active indicator — offsetTop/offsetHeight against offsetParent
      //    (the rail list) is cheap, no full layout flush.
      if (activeEl) {
        const top = activeEl.offsetTop;
        const height = activeEl.offsetHeight;
        const ind = indicatorRef.current;
        if (ind) {
          if (top !== lastIndTop) {
            lastIndTop = top;
            ind.style.transform = `translateY(${top}px)`;
          }
          if (height !== lastIndHeight) {
            lastIndHeight = height;
            ind.style.height = `${height}px`;
          }
        }
      }
    };

    const schedule = () => {
      if (ticking) return;
      ticking = true;
      rafId = window.requestAnimationFrame(writeRailFrame);
    };

    // Expose so active-change effect and pointer scrubs funnel into the
    // same scheduler — one rAF, one ordered write pass.
    scheduleRailFrameRef.current = schedule;

    const onResize = () => {
      docMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      // Rail height may have shifted even if active row didn't — force
      // indicator geometry to re-write on the next frame.
      lastIndTop = Number.NaN;
      lastIndHeight = Number.NaN;
      schedule();
    };

    writeRailFrame();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    // Layout of the page changes as images/fonts load and reveals expand —
    // keep docMax honest without polling.
    const ro = new ResizeObserver(onResize);
    ro.observe(document.documentElement);

    return () => {
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      scheduleRailFrameRef.current = () => {};
    };
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    // Route active-state / visibility flips through the single rail-frame
    // scheduler so the indicator write lands in the same ordered pass as
    // the progress fill — no dueling rAFs, no split ordering.
    scheduleRailFrameRef.current();
    const ro = new ResizeObserver(() => scheduleRailFrameRef.current());
    ro.observe(list);
    return () => ro.disconnect();
  }, [active, visible]);

  const handleRailPointerDown = (e: PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    // A fresh press on the rail always wins over any in-flight animation.
    cancelSmoothScroll();
    cancelInertia();
    // If a prior gesture never cleanly released (rare browser edge case),
    // tear it down before starting a new one so state stays consistent.
    if (activePointerIdRef.current !== null) {
      finishScrub("pointercancel", null);
    }
    pointerTypeRef.current = e.pointerType;
    // Velocity samples are only used for touch inertia.
    scrubSamplesRef.current = e.pointerType === "touch" ? [{ y: window.scrollY, t: now() }] : [];
    dragStartYRef.current = e.clientY;
    draggingRef.current = false;
    suppressClickRef.current = false;
    // Try to capture — some browsers/pointer types (rare synthetic events)
    // reject; either way, record the id so global cleanup can find it.
    try {
      listRef.current?.setPointerCapture?.(e.pointerId);
    } catch {
      /* capture unavailable — global safety net still handles cancel */
    }
    activePointerIdRef.current = e.pointerId;
  };
  const handleRailPointerMove = (e: PointerEvent) => {
    const list = listRef.current;
    if (!list?.hasPointerCapture?.(e.pointerId)) return;
    const dy = e.clientY - dragStartYRef.current;
    const isTouch = pointerTypeRef.current === "touch";
    // Touch pointers are less precise than a mouse — use a larger threshold
    // so a stationary tap doesn't get promoted to a drag by finger jitter.
    const threshold = isTouch ? 8 : 4;
    if (!draggingRef.current && Math.abs(dy) < threshold) return;
    if (!draggingRef.current) {
      draggingRef.current = true;
      suppressClickRef.current = true;
      setScrubbing(true);
    }
    e.preventDefault();
    if (isTouch) {
      // Touch: rAF-coalesce writes and sample velocity so release can fling.
      pushSample(e.clientY);
      scheduleScrub(e.clientY);
    } else {
      // Mouse / pen: 1:1 with the cursor. Apply synchronously so the page
      // tracks the pointer every frame, like a native scrollbar thumb —
      // no rAF batching, no velocity buffering, no inertia on release.
      applyScrubFromClientY(e.clientY);
    }
  };
  // Single teardown path for every scrub end (clean release, cancel, or
  // global safety-net). `endType` mirrors PointerEvent.type semantics —
  // "pointercancel" skips inertia and skips click/tap resolution; `clientY`
  // is null when the global safety net triggered (no pointer coordinates).
  const finishScrub = (endType: string, clientY: number | null) => {
    const list = listRef.current;
    const pid = activePointerIdRef.current;
    // Always attempt to release capture — belt and braces against browsers
    // that report hasPointerCapture=false while still holding it.
    if (list && pid !== null) {
      try {
        if (list.hasPointerCapture?.(pid)) list.releasePointerCapture(pid);
      } catch {
        /* already released */
      }
    }
    // Always flush any pending scrub rAF so scroll position is final before
    // we decide what to do next — otherwise inertia (or the resync frame)
    // starts from a stale y.
    if (scrubRafRef.current !== null) {
      window.cancelAnimationFrame(scrubRafRef.current);
      scrubRafRef.current = null;
      if (pendingScrubYRef.current !== null) {
        applyScrubFromClientY(pendingScrubYRef.current);
        pendingScrubYRef.current = null;
      }
    }
    const isTouch = pointerTypeRef.current === "touch";
    const wasDragging = draggingRef.current;
    if (wasDragging) {
      if (isTouch && endType !== "pointercancel") {
        startInertia(releaseVelocity());
      }
      // Reset next tick so the anchor's own click handler (fired after
      // pointerup) still sees suppressClickRef=true and cancels navigation.
      window.setTimeout(() => {
        draggingRef.current = false;
        setScrubbing(false);
      }, 0);
    } else if (endType !== "pointercancel" && clientY !== null) {
      // Non-drag release with real coordinates = a click/tap on the rail.
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
      const id = nearestChapterId(clientY);
      if (id) jumpToChapter(id);
    }
    scrubSamplesRef.current = [];
    activePointerIdRef.current = null;
    // Force one final ordered write pass so progress fill and active
    // indicator reflect the final scroll position immediately — don't
    // wait for the next scroll event (which may never fire if the drag
    // ended exactly on the current scroll pos).
    scheduleRailFrameRef.current();
  };

  const handleRailPointerUp = (e: PointerEvent) => {
    // Ignore stray up/cancel from pointers we didn't capture (e.g. a second
    // finger releasing while the primary drag continues).
    if (activePointerIdRef.current !== null && e.pointerId !== activePointerIdRef.current) {
      return;
    }
    finishScrub(e.type, e.clientY);
  };

  // The pointer handlers are recreated every render, but the native-listener
  // effect below must mount exactly once (it controls passive flags and the
  // global safety nets). Route events through a ref that always holds the
  // latest closures, so the effect keeps a stable dependency list instead of
  // re-attaching listeners (or capturing stale handlers) on every render.
  const railHandlersRef = useRef({
    down: handleRailPointerDown,
    move: handleRailPointerMove,
    up: handleRailPointerUp,
    finish: finishScrub,
  });
  useEffect(() => {
    railHandlersRef.current = {
      down: handleRailPointerDown,
      move: handleRailPointerMove,
      up: handleRailPointerUp,
      finish: finishScrub,
    };
  });

  // Attach rail pointer listeners natively so we control passive flags:
  // down/up/cancel are passive (never preventDefault → browser doesn't have
  // to wait on JS before scrolling elsewhere on the page); move stays
  // non-passive because a promoted drag calls preventDefault to suppress
  // native text/scroll selection. React's synthetic delegation would attach
  // all four as non-passive on the root — this avoids that overhead.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const handlers = railHandlersRef;
    const down = (e: PointerEvent) => handlers.current.down(e);
    const move = (e: PointerEvent) => handlers.current.move(e);
    const up = (e: PointerEvent) => handlers.current.up(e);
    list.addEventListener("pointerdown", down, { passive: true });
    list.addEventListener("pointermove", move, { passive: false });
    list.addEventListener("pointerup", up, { passive: true });
    list.addEventListener("pointercancel", up, { passive: true });
    // Safety nets: if the OS/browser hijacks the gesture, the tab is
    // backgrounded, or focus is stolen mid-drag, element-scoped
    // pointerup/cancel may never arrive. Force cleanup so the rail can't
    // get stuck in a captured/dragging state.
    const onWindowCancel = (e: PointerEvent) => {
      if (activePointerIdRef.current !== null && e.pointerId === activePointerIdRef.current) {
        handlers.current.finish("pointercancel", null);
      }
    };
    const onWindowUp = (e: PointerEvent) => {
      // Only fires if the element handler missed it (e.g. pointer released
      // outside a captured region on a browser that dropped capture).
      if (activePointerIdRef.current !== null && e.pointerId === activePointerIdRef.current) {
        handlers.current.finish(e.type, e.clientY);
      }
    };
    const onLostCapture = () => {
      if (activePointerIdRef.current !== null) {
        handlers.current.finish("pointercancel", null);
      }
    };
    const onBlurOrHide = () => {
      if (activePointerIdRef.current !== null) {
        handlers.current.finish("pointercancel", null);
      }
    };
    window.addEventListener("pointercancel", onWindowCancel, { passive: true });
    window.addEventListener("pointerup", onWindowUp, { passive: true });
    list.addEventListener("lostpointercapture", onLostCapture, { passive: true });
    window.addEventListener("blur", onBlurOrHide);
    document.addEventListener("visibilitychange", onBlurOrHide);
    return () => {
      list.removeEventListener("pointerdown", down);
      list.removeEventListener("pointermove", move);
      list.removeEventListener("pointerup", up);
      list.removeEventListener("pointercancel", up);
      window.removeEventListener("pointercancel", onWindowCancel);
      window.removeEventListener("pointerup", onWindowUp);
      list.removeEventListener("lostpointercapture", onLostCapture);
      window.removeEventListener("blur", onBlurOrHide);
      document.removeEventListener("visibilitychange", onBlurOrHide);
    };
  }, []);

  return (
    <aside
      className={`pointer-events-none fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 transition-opacity duration-500 xl:flex ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div
        ref={listRef}
        className={`pointer-events-auto relative flex min-h-[420px] flex-col py-2 pl-3 pr-2 touch-none select-none ${scrubbing ? "cursor-grabbing" : "cursor-grab"}`}
        role="slider"
        aria-label="Page scroll position"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
      >
        {/* vertical track */}
        <span
          className="pointer-events-none absolute left-0 top-1 bottom-1 w-0.5 bg-border/70"
          aria-hidden
        />
        {/* progress fill */}
        <span
          ref={progressFillRef}
          className="pointer-events-none absolute left-0 top-1 w-0.5 origin-top bg-foreground/40"
          style={{
            height: "calc(100% - 0.5rem)",
            transform: "scaleY(0)",
            transformOrigin: "top",
            willChange: "transform",
          }}
          aria-hidden
        />
        {/* active indicator */}
        <span
          ref={indicatorRef}
          className="pointer-events-none absolute left-[-1px] w-[3px] rounded-full bg-accent"
          style={{
            transform: "translateY(0px)",
            height: "12px",
            willChange: "transform, height",
            transition: "transform 180ms cubic-bezier(0.22, 1, 0.36, 1), height 140ms ease-out",
          }}
          aria-hidden
        />
        {NAV.map((n, i) => {
          const id = n.href.slice(1);
          const isActive = active === id;
          const isHovered = hovered === id;
          const showTip = isHovered;
          return (
            <a
              key={id}
              href={n.href}
              ref={(el) => {
                itemsRef.current[id] = el;
              }}
              className="pointer-events-auto group relative flex flex-1 min-h-[32px] cursor-pointer items-center gap-3 rounded-sm px-1 transition-colors hover:bg-foreground/[0.03] focus-visible:outline-none focus-visible:bg-foreground/[0.04]"
              aria-label={`Jump to ${n.label}`}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered((h) => (h === id ? null : h))}
              onFocus={() => setHovered(id)}
              onBlur={() => setHovered((h) => (h === id ? null : h))}
              onClick={(e) => {
                // Swallow the click if the user was scrubbing — pointerup
                // fires before click, so draggingRef is still true here.
                if (suppressClickRef.current || draggingRef.current) {
                  e.preventDefault();
                  suppressClickRef.current = false;
                  return;
                }
                e.preventDefault();
                // Update the URL hash without the browser's default jump so
                // our smooth scroll owns the motion. Fall back to hash= if
                // history is unavailable.
                if (window.history?.pushState) {
                  window.history.pushState(null, "", n.href);
                  // hashchange doesn't fire for pushState, so sync manually.
                  setActive(id);
                } else {
                  window.location.hash = n.href;
                }
                scrollToTargetId(id);
              }}
            >
              <span
                className={`h-px transition-all duration-300 ease-out ${isActive ? "w-6 bg-accent" : "w-3 bg-border group-hover:w-5 group-hover:bg-foreground/60"}`}
              />
              <span
                aria-hidden
                className={`font-mono text-[10px] uppercase tracking-[0.14em] transition-all duration-300 ${isActive ? "text-accent opacity-100 translate-x-0" : "text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"}`}
              >
                {String(i + 1).padStart(2, "0")} · {n.label}
              </span>
            </a>
          );
        })}
      </div>
    </aside>
  );
}
