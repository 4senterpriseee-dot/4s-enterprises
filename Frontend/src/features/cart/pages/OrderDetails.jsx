import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Layout from "@/components/layout/Layout";
import { Package, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getPaymentByOrderId } from "../service/cart.api";
import PageSkeleton from "@/components/ui/PageSkeleton";

// ── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

// ── Sub-components ─────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const map = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${map[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {status === "paid" && (
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
      )}
      {status ?? "—"}
    </span>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────

/**
 * Full order breakdown page accessed from /orders/:orderId.
 * Shows all items, quantities, prices, and total.
 * Products are clickable → /product/:id.
 */
const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    setLoading(true);
    getPaymentByOrderId(orderId)
      .then((data) => {
        if (data?.success && data?.payment) {
          setOrder(data.payment);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [orderId]);

  // ── Guards ─────────────────────────────────────────────────────────────

  if (!orderId) return null;

  if (loading) {
    return (
      <Layout>
        <PageSkeleton />
      </Layout>
    );
  }

  if (notFound) {
    return (
      <Layout>
        <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-4 py-20 text-center sm:px-6">
          <AlertCircle size={48} className="text-red-400" strokeWidth={1.2} />
          <h1 className="text-xl font-semibold text-(--text)">Order not found</h1>
          <p className="text-sm text-[var(--text-muted)]">
            We couldn&apos;t find an order for this ID.
          </p>
          <Button
            onClick={() => navigate("/orders")}
            className="mt-2 bg-[var(--primary-btn)] text-[var(--card)]"
          >
            Back to Orders
          </Button>
        </section>
      </Layout>
    );
  }

  const subtotal = order?.price?.amount ?? 0;
  const orderItems = order?.orderItems ?? [];

  return (
    <Layout>
      <section className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">

        {/* ── Back link ─────────────────────────────────────────────────── */}
        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="mb-6 flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-(--text) transition"
        >
          <ArrowLeft size={15} />
          Back to Orders
        </button>

        {/* ── Page title ────────────────────────────────────────────────── */}
        <h1 className="mb-6 text-xl font-bold text-(--text)">Order Details</h1>

        {/* ── Order meta card ───────────────────────────────────────────── */}
        <div className="mb-6 rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Summary
          </h2>

          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <p className="mb-0.5 text-[var(--text-muted)]">Order ID</p>
              <p
                className="truncate font-mono text-xs font-medium text-(--text)"
                title={order?.razorpay?.orderId}
              >
                {order?.razorpay?.orderId ?? "—"}
              </p>
            </div>

            <div>
              <p className="mb-0.5 text-[var(--text-muted)]">Date</p>
              <p className="font-medium text-(--text)">{formatDate(order?.createdAt)}</p>
            </div>

            <div>
              <p className="mb-0.5 text-[var(--text-muted)]">Status</p>
              <StatusBadge status={order?.status} />
            </div>

            <div>
              <p className="mb-0.5 text-[var(--text-muted)]">Total</p>
              <p className="font-semibold text-(--text)">
                ₹{subtotal.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {/* ── Items list ────────────────────────────────────────────────── */}
        {orderItems.length > 0 && (
          <div className="mb-6 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <h2 className="border-b border-[var(--border)] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Items Ordered
            </h2>

            <ul>
              {orderItems.map((item, i) => (
                <li
                  key={item?.productId ?? i}
                  className={`flex items-start gap-4 px-5 py-4 ${
                    i < orderItems.length - 1
                      ? "border-b border-[var(--border)]"
                      : ""
                  }`}
                >
                  {/* Product image — clickable */}
                  <button
                    type="button"
                    onClick={() =>
                      item?.productId && navigate(`/product/${item.productId}`)
                    }
                    className="shrink-0 overflow-hidden rounded bg-[var(--card-subtle)] focus:outline-none"
                    aria-label={`View ${item?.title}`}
                  >
                    {item?.images?.url ? (
                      <img
                        src={item.images.url}
                        alt={item.title ?? "Product"}
                        className="h-24 w-20 object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-24 w-20 items-center justify-center">
                        <Package size={18} className="text-[var(--text-muted)]" />
                      </div>
                    )}
                  </button>

                  {/* Product details */}
                  <div className="flex flex-1 flex-col gap-1 text-sm">
                    <button
                      type="button"
                      onClick={() =>
                        item?.productId && navigate(`/product/${item.productId}`)
                      }
                      className="text-left font-medium text-(--text) hover:underline focus:outline-none"
                    >
                      {item?.title ?? "—"}
                    </button>

                    <div className="flex flex-wrap gap-3 text-xs text-[var(--text-muted)]">
                      {item?.size && <span>Size: {item.size}</span>}
                      <span>Qty: {item?.quantity ?? 1}</span>
                      <span>
                        Unit price: ₹{(item?.price?.amount ?? 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Line total */}
                  <p className="shrink-0 text-sm font-semibold text-(--text)">
                    ₹
                    {(
                      (item?.price?.amount ?? 0) * (item?.quantity ?? 1)
                    ).toLocaleString("en-IN")}
                  </p>
                </li>
              ))}
            </ul>

            {/* Subtotal row */}
            <div className="flex justify-end border-t border-[var(--border)] px-5 py-3 text-sm">
              <span className="text-[var(--text-muted)]">Total&nbsp;</span>
              <span className="font-semibold text-(--text)">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        )}

        {/* ── Action ────────────────────────────────────────────────────── */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => navigate("/orders")}
            className="w-full sm:w-auto"
            id="back-to-orders-btn"
          >
            Back to Orders
          </Button>
        </div>

      </section>
    </Layout>
  );
};

export default OrderDetails;
