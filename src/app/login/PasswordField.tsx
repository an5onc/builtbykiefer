"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function getPasswordVisibilityState(isVisible: boolean) {
  return {
    buttonLabel: isVisible ? "Hide password" : "Show password",
    inputType: isVisible ? "text" : "password",
  } as const;
}

export default function PasswordField() {
  const [isVisible, setIsVisible] = useState(false);
  const { buttonLabel, inputType } = getPasswordVisibilityState(isVisible);
  const Icon = isVisible ? EyeOff : Eye;

  return (
    <label className="block text-sm font-semibold text-white/80">
      Password
      <span className="relative mt-2 block">
        <input
          name="password"
          type={inputType}
          autoComplete="current-password"
          className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-3 pr-12 text-white outline-none transition focus:border-[#e04a36]"
          required
        />
        <button
          type="button"
          aria-label={buttonLabel}
          aria-pressed={isVisible}
          title={buttonLabel}
          onClick={() => setIsVisible((current) => !current)}
          className="absolute right-2 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-white/65 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e04a36]"
        >
          <Icon aria-hidden="true" className="size-5" />
        </button>
      </span>
    </label>
  );
}
