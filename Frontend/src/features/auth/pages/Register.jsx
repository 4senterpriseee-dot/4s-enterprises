import React, { useState } from "react";
import { Store, User, Phone, Mail, Lock, ChevronRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setError } from "../state/auth.slice";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../../../components/ui/Button";
import FormField from "../components/FormField";
import GoogleButton from "../../../components/ui/GoogleButton";
import { useNavigate } from "react-router";

/* ─── Register Page ───────────────────────────────────── */
const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    fullname: "",
    contact: "",
    email: "",
    password: "",
    isSeller: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = (isGoogle = false) => {
    const newErrors = {};

    if (!form.fullname.trim()) newErrors.fullname = "Full name is required.";

    if (!isGoogle) {
      if (!form.contact.trim())
        newErrors.contact = "Contact number is required.";
      else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.contact))
        newErrors.contact = "Enter a valid contact number.";

      if (!form.password) newErrors.password = "Password is required.";
      else if (form.password.length < 8)
        newErrors.password = "Password must be at least 8 characters.";
    }

    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email address.";

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
      await handleRegister({
        email: form.email,
        fullname: form.fullname,
        contact: form.contact,
        password: form.password,
        isSeller: form.isSeller,
      });

      navigate("/");
    } catch (err) {
      const { field, message } = err?.response?.data ?? {};

      if (field && message) {
        setErrors({ [field]: message });
      } else {
        dispatch(setError(message || "Something went wrong"));
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
        aria-label="Create your account"
      >
        {/* ── Brand Mark ── */}
        <header className="mb-6">
          {/* Logo + brand name inline row */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-(--primary-btn) shrink-0">
              <Store size={16} color="#fff" strokeWidth={2} />
            </div>
            <h1 className="text-lg font-bold tracking-widest uppercase text-(--text) leading-none">
              4senterprises
            </h1>
          </div>

          {/* Tagline — left aligned, compact */}
          <p className="mt-1.5 text-[12px] text-[var(--text-muted)] font-normal tracking-normal">
            Create your account to start shopping.
          </p>
        </header>

        {/* ── Form ── */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-3"
        >
          <FormField
            id="fullname"
            label="Full Name"
            placeholder="Name"
            icon={User}
            value={form.fullname}
            onChange={handleChange}
            error={errors.fullname}
            autoComplete="name"
          />

          <FormField
            id="contact"
            label="Contact Number"
            type="tel"
            placeholder="Contact Number"
            icon={Phone}
            value={form.contact}
            onChange={handleChange}
            error={errors.contact}
            autoComplete="tel"
          />

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
            autoComplete="new-password"
          />

          {/* ── Seller Checkbox ── */}
          <label
            htmlFor="isSeller"
            className="flex items-center gap-3 cursor-pointer group pt-0.5"
          >
            {/* Hidden native checkbox (accessibility) */}
            <input
              id="isSeller"
              name="isSeller"
              type="checkbox"
              checked={form.isSeller}
              onChange={handleChange}
              className="sr-only peer"
            />

            {/* Custom checkbox box */}
            <div
              aria-hidden="true"
              className={[
                "shrink-0 w-[18px] h-[18px] rounded border flex items-center justify-center",
                "transition-colors duration-150",
                form.isSeller
                  ? "bg-[var(--primary-btn)] border-[var(--primary-btn)]"
                  : "bg-[var(--card)] border-[var(--border)] group-hover:border-[var(--border-focus)]",
              ].join(" ")}
            >
              {form.isSeller && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path
                    d="M1 3.5L4 6.5L9 1"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>

            {/* Label text */}
            <div className="leading-snug">
              <span className="text-sm font-medium text-(--text)">
                Register as Seller
              </span>
              <p className="text-[11px] text-[var(--text-muted)] mt-0">
                Optional — list products &amp; manage your storefront
              </p>
            </div>
          </label>

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
                Creating Account…
              </>
            ) : (
              <>
                Create Account
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
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-[var(--primary-btn)] underline-offset-2 hover:underline transition-all duration-150"
          >
            Sign In
          </a>
        </p>
      </section>
    </main>
  );
};

export default Register;
