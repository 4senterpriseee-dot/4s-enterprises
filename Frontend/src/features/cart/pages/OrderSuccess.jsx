import { useNavigate, useParams } from "react-router";
import Layout from "@/components/layout/Layout";
import { CheckCircle, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/Button";

// ── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

// ── Component ──────────────────────────────────────────────────────────────

/**
 * Shown immediately after a successful Razorpay payment.
 * Keeps the success celebration focused — full order breakdown lives in
 * OrderDetails.jsx (/orders/:orderId).
 */
const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <Layout>
      <section className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">

        {/* ── Success icon + heading ── */}
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-50 ring-8 ring-green-100">
            <CheckCircle size={52} className="text-green-500" strokeWidth={1.5} />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-(--text) sm:text-3xl">
            Payment Successful!
          </h1>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            Thank you for your purchase. Your order has been confirmed and
            we&apos;re preparing your items.
          </p>
        </div>

        {/* ── Order reference card ── */}
        <div className="mb-8 rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Order Reference
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="mb-0.5 text-[var(--text-muted)]">Order ID</p>
              <p
                className="truncate font-mono text-xs font-medium text-(--text)"
                title={orderId}
              >
                {orderId ?? "—"}
              </p>
            </div>
            <div>
              <p className="mb-0.5 text-[var(--text-muted)]">Date</p>
              <p className="font-medium text-(--text)">{formatDate()}</p>
            </div>
          </div>
        </div>

        {/* ── What's next banner ── */}
        <div className="mb-8 flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
          <Package
            size={20}
            className="mt-0.5 shrink-0 text-[var(--text-muted)]"
          />
          <div>
            <p className="text-sm font-medium text-(--text)">What happens next?</p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              You&apos;ll receive a confirmation shortly. Your order will be
              dispatched within 1–2 business days.
            </p>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={() => navigate("/orders")}
            className="w-full bg-[var(--primary-btn)] text-[var(--card)] sm:w-auto"
            id="view-orders-btn"
          >
            View My Orders
            <ArrowRight size={16} className="ml-1" />
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto"
            id="continue-shopping-btn"
          >
            Continue Shopping
          </Button>
        </div>

      </section>
    </Layout>
  );
};

export default OrderSuccess;
