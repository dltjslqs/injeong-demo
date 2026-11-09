"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { FormState } from "./actions";

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;

/** A form wired to a server action; shows the action's error message above the buttons. */
export function ActionForm({ action, children, className }: { action: Action; children: React.ReactNode; className?: string }) {
  const [state, run] = useActionState(action, null);
  return (
    <form action={run} className={className}>
      {children}
      {state?.message && <p className="ad-err" role="alert">{state.message}</p>}
    </form>
  );
}

export function Submit({ children = "저장" }: { children?: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="ad-btn primary" disabled={pending}>
      {pending ? "저장 중" : children}
    </button>
  );
}

/** Asks before a destructive submit. */
export function ConfirmButton({ children, message, className = "ad-btn danger" }: { children: React.ReactNode; message: string; className?: string }) {
  return (
    <button type="submit" className={className} onClick={(e) => { if (!window.confirm(message)) e.preventDefault(); }}>
      {children}
    </button>
  );
}

