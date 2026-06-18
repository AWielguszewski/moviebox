"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from "react";

import { CloseIcon } from "@/components/ui/icons";

const SWIPE_CLOSE_THRESHOLD = 120;

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function MovieModal({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => router.back(), [router]);

  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStartY = useRef<number | null>(null);

  function handleTouchStart(event: TouchEvent) {
    dragStartY.current = event.touches[0].clientY;
    setDragging(true);
  }

  function handleTouchMove(event: TouchEvent) {
    if (dragStartY.current === null) return;
    const delta = event.touches[0].clientY - dragStartY.current;
    setDragY(delta > 0 ? delta : 0);
  }

  function handleTouchEnd() {
    setDragging(false);
    dragStartY.current = null;
    if (dragY > SWIPE_CLOSE_THRESHOLD) {
      close();
    } else {
      setDragY(0);
    }
  }

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        FOCUSABLE,
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [close]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={close}
        aria-hidden
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
          transition: dragging ? "none" : "transform 0.25s ease",
        }}
        className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-2xl border border-border bg-background p-5 shadow-2xl sm:max-h-[85vh] sm:max-w-3xl sm:rounded-2xl sm:p-6"
      >
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="-mt-1 mb-2 flex touch-none justify-center py-2 sm:hidden"
          aria-hidden
        >
          <span className="h-1.5 w-10 rounded-full bg-muted/50" />
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 rounded-full bg-surface/80 p-2 text-muted backdrop-blur transition-colors hover:bg-surface hover:text-foreground"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
