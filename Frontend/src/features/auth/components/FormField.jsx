import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * FormField — Input with optional leading icon, sr-only label,
 * inline error, and optional password-visibility toggle.
 *
 * @param {string}            id
 * @param {string}            label          — always rendered, visually hidden (sr-only)
 * @param {string}            [type="text"]
 * @param {string}            [placeholder]
 * @param {React.ElementType} [icon]         — Lucide icon (left slot)
 * @param {string}            value
 * @param {Function}          onChange
 * @param {string}            [error]
 * @param {string}            [autoComplete]
 * @param {boolean}           [showToggle]   — show eye icon for password fields
 */

const FormField = ({
  id,
  label,
  type = "text",
  placeholder,
  icon: Icon,
  value,
  onChange,
  error,
  autoComplete,
  showToggle = false,
}) => {
  const [visible, setVisible] = useState(false);
  const inputType = showToggle ? (visible ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1">
      {/* Input wrapper */}
      <div className="relative">
        {/* Left icon */}
        {Icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[var(--text-muted)]">
            <Icon size={14} strokeWidth={1.75} />
          </span>
        )}

        <input
          id={id}
          name={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={[
            "input-field w-full rounded-lg border bg-[var(--card)]",
            "px-3.5 py-2.5 text-sm text-(--text) placeholder:text-[var(--text-muted)]",
            Icon ? "pl-10" : "",
            showToggle ? "pr-10" : "",
            error
              ? "border-[var(--error)]"
              : "border-[var(--border)] hover:border-[var(--border-focus)]",
          ].join(" ")}
        />

        {/* Right: password toggle */}
        {showToggle && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={visible ? "Hide password" : "Show password"}
            onClick={() => setVisible((v) => !v)}
            className="absolute inset-y-0 right-3 flex items-center text-[var(--text-muted)] hover:text-(--text) transition-colors duration-150"
          >
            {visible ? (
              <EyeOff size={14} strokeWidth={1.75} />
            ) : (
              <Eye size={14} strokeWidth={1.75} />
            )}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-[11px] text-[var(--error)]"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
