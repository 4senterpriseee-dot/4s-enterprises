import React, { useState } from "react";
import { Store, Mail, Lock, ChevronRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setError } from "../state/auth.slice";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../../../components/ui/Button";
import FormField from "../components/FormField";
import GoogleButton from "../../../components/ui/GoogleButton";
import { useNavigate } from "react-router";

/* ─── Login Page ──────────────────────────────────────── */
const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ── Handlers ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email address.";
    if (!form.password) newErrors.password = "Password is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    dispatch(setError(null));
    setIsSubmitting(true);

    try {
      const user = await handleLogin({
        email: form.email,
        password: form.password,
      });

      if (user.role === "seller") {
        navigate("/seller/dashboard");
      } else if (user.role === "buyer") {
        navigate("/");
      }
    } catch (err) {
      // Backend login errors are plain { message } — map to field when possible
      const { field, message } = err?.response?.data ?? {};

      if (field && message) {
        // Structured field error (future-proof)
        setErrors({ [field]: message });
      } else if (message === "User not found") {
        setErrors({ email: "No account found with this email." });
      } else if (message === "Invalid password") {
        setErrors({ password: "Incorrect password." });
      } else {
        // Fallback — useAuth already dispatched setError
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 py-10">
      {/* ── Card ── */}
      <section
        className="register-card w-full max-w-[420px] bg-[var(--card)] rounded-2xl border border-[var(--border)] p-7 sm:p-8"
        style={{ boxShadow: "0 6px 32px rgba(27,28,26,0.07)" }}
        aria-label="Sign in to your account"
      >
        {/* ── Brand Mark ── */}
        <header className="mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--primary-btn)] shrink-0">
              <Store size={16} color="#fff" strokeWidth={2} />
            </div>
            <h1 className="text-lg font-bold tracking-widest uppercase text-(--text) leading-none">
              4senterprises
            </h1>
          </div>
          <p className="mt-1.5 text-[12px] text-[var(--text-muted)] font-normal tracking-normal">
            Welcome back. Sign in to continue.
          </p>
        </header>

        {/* ── Form ── */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-3"
        >
          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="Email"
            icon={Mail}
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
          />

          <FormField
            id="password"
            label="Password"
            placeholder="Password"
            icon={Lock}
            showToggle
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="current-password"
          />

          {/* ── Submit Button ── */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 py-2.5 text-sm font-medium tracking-normal"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Signing In…
              </>
            ) : (
              <>
                Sign In
                <ChevronRight size={14} strokeWidth={2} />
              </>
            )}
          </Button>

          {/* ── Or Divider ── */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-[11px] text-[var(--text-muted)] font-normal">
              or
            </span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          {/* ── Google OAuth ── */}
          <GoogleButton />
        </form>

        {/* ── Divider ── */}
        <div className="my-5 h-px bg-[var(--card-subtle)]" />

        {/* ── Footer ── */}
        <p className="text-[11px] text-[var(--text-muted)]">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="font-medium text-[var(--primary-btn)] underline-offset-2 hover:underline transition-all duration-150"
          >
            Sign Up
          </a>
        </p>
      </section>
    </main>
  );
};

export default Login;
