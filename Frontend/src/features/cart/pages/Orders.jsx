import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Layout from "@/components/layout/Layout";
import { getUserOrders } from "../service/cart.api";
import { ShoppingBag, Package, ChevronRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import PageSkeleton from "@/components/ui/PageSkeleton";

// ── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

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

// ── Skeletons ──────────────────────────────────────────────────────────────
// Replaced with global PageSkeleton


// ── Order Card ─────────────────────────────────────────────────────────────

const OrderCard = ({ order, onViewDetails }) => {
  const previewImages = order.orderItems
    ?.slice(0, 2)
    .map((item) => item?.images?.url)
    .filter(Boolean);

  const total = order?.price?.amount ?? 0;
  const orderId = order?.razorpay?.orderId ?? "—";
  const itemCount = order?.orderItems?.length ?? 0;

  return (
    <div className="group rounded-lg border border-[var(--border)] bg-[var(--card)] transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">

        {/* Left — images + meta */}
        <div className="flex items-center gap-4">
          {/* Product preview thumbnails */}
          <div className="flex -space-x-2">
            {previewImages.length > 0 ? (
              previewImages.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Order item ${i + 1}`}
                  className="h-14 w-11 rounded object-cover ring-2 ring-[var(--card)]"
                  loading="lazy"
                />
              ))
            ) : (
              <div className="flex h-14 w-11 items-center justify-center rounded bg-[var(--card-subtle)]">
                <Package size={18} className="text-[var(--text-muted)]" />
              </div>
            )}
          </div>

          {/* Meta */}
          <div className="space-y-1">
            <p className="font-mono text-xs text-[var(--text-muted)]" title={orderId}>
              #{orderId.slice(-10).toUpperCase()}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              {formatDate(order.createdAt)} · {itemCount} item{itemCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Right — status, total, action */}
        <div className="flex items-center gap-4 sm:gap-6">
          <StatusBadge status={order.status} />

          <p className="text-sm font-semibold text-(--text)">
            ₹{total.toLocaleString("en-IN")}
          </p>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(orderId)}
            className="flex items-center gap-1 text-xs"
            id={`view-order-${orderId}`}
          >
            View Details
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    getUserOrders()
      .then((data) => {
        if (data?.success) {
          setOrders(data.payments ?? []);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const handleViewDetails = (razorpayOrderId) => {
    navigate(`/orders/${razorpayOrderId}`);
  };

  // ── Loading ────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <Layout>
        <PageSkeleton />
      </Layout>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────

  if (error) {
    return (
      <Layout>
        <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-4 py-20 text-center sm:px-6">
          <AlertCircle size={44} className="text-red-400" strokeWidth={1.4} />
          <h1 className="text-xl font-semibold text-(--text)">Couldn't load orders</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Something went wrong. Please try refreshing the page.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-2 bg-[var(--primary-btn)] text-[var(--card)]"
          >
            Retry
          </Button>
        </section>
      </Layout>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────

  if (orders.length === 0) {
    return (
      <Layout>
        <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-4 py-20 text-center sm:px-6">
          <ShoppingBag size={52} className="text-[var(--text-muted)]" strokeWidth={1.2} />
          <h1 className="text-xl font-semibold text-(--text)">No orders yet</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Looks like you haven't placed any orders. Start shopping!
          </p>
          <Button
            onClick={() => navigate("/")}
            className="mt-2 bg-[var(--primary-btn)] text-[var(--card)]"
            id="start-shopping-btn"
          >
            Start Shopping
          </Button>
        </section>
      </Layout>
    );
  }

  // ── Orders list ────────────────────────────────────────────────────────

  return (
    <Layout>
      <section className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--text-muted)]">Home / Orders</p>
            <h1 className="mt-1 text-xl font-bold text-(--text)">Your Orders</h1>
          </div>
          <span className="rounded-full bg-[var(--card-subtle)] px-3 py-1 text-xs text-[var(--text-muted)]">
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Orders;
