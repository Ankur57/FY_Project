import { useEffect, useState } from "react";
import axios from "../../api/axios";

/* ─── Status Badge Config ─── */
const STATUS_CONFIG = {
    pending: { label: "Pending", bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
    paid: { label: "Paid", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
    shipped: { label: "Shipped", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
    delivered: { label: "Delivered", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
    cancelled: { label: "Cancelled", bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400" },
};

const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${config.bg} ${config.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
};

/* ─── Filter Tab ─── */
const FilterTab = ({ label, active, count, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${active
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
            }`}
    >
        {label}
        {count !== undefined && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? "bg-white/20" : "bg-gray-200"}`}>
                {count}
            </span>
        )}
    </button>
);

function AdminAllOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    const fetchAllOrders = async () => {
        try {
            const res = await axios.get("/orders/admin/orders");
            setOrders(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const filteredOrders = filter === "all"
        ? orders
        : orders.filter((o) => o.orderStatus === filter);

    const counts = {
        all: orders.length,
        paid: orders.filter((o) => o.orderStatus === "paid").length,
        shipped: orders.filter((o) => o.orderStatus === "shipped").length,
        delivered: orders.filter((o) => o.orderStatus === "delivered").length,
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 md:p-10">
                <div className="max-w-6xl mx-auto">
                    <div className="h-10 w-64 bg-gray-200 rounded-xl mb-8 animate-pulse" />
                    <div className="h-12 w-96 bg-gray-200 rounded-xl mb-6 animate-pulse" />
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse mb-3" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 p-4 md:p-8 lg:p-10">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        All Orders
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        Complete overview of all orders across every status.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <FilterTab label="All" active={filter === "all"} count={counts.all} onClick={() => setFilter("all")} />
                    <FilterTab label="Paid" active={filter === "paid"} count={counts.paid} onClick={() => setFilter("paid")} />
                    <FilterTab label="Shipped" active={filter === "shipped"} count={counts.shipped} onClick={() => setFilter("shipped")} />
                    <FilterTab label="Delivered" active={filter === "delivered"} count={counts.delivered} onClick={() => setFilter("delivered")} />
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    {filteredOrders.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-700 mb-1">No Orders Found</h3>
                            <p className="text-gray-400 text-sm">No orders match the selected filter.</p>
                        </div>
                    ) : (
                        <>
                            {/* Table Header */}
                            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                                <div className="col-span-3">Order</div>
                                <div className="col-span-3">Customer</div>
                                <div className="col-span-2">Amount</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-2">Date</div>
                            </div>

                            {/* Table Rows */}
                            {filteredOrders.map((order) => (
                                <div
                                    key={order._id}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 border-b border-gray-50 hover:bg-indigo-50/30 transition-colors duration-200 items-center"
                                >
                                    {/* Order Number */}
                                    <div className="col-span-3">
                                        <p className="font-bold text-gray-900 text-sm">{order.orderNumber}</p>
                                        <p className="text-xs text-gray-400 md:hidden">
                                            {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </p>
                                    </div>

                                    {/* Customer */}
                                    <div className="col-span-3">
                                        <p className="text-sm font-medium text-gray-800">{order.userId?.name || order.addressSnapshot?.fullName || "—"}</p>
                                        <p className="text-xs text-gray-400">{order.userId?.email || ""}</p>
                                    </div>

                                    {/* Amount */}
                                    <div className="col-span-2">
                                        <p className="text-sm font-bold text-gray-900">₹ {order.totalAmount?.toLocaleString("en-IN")}</p>
                                    </div>

                                    {/* Status */}
                                    <div className="col-span-2">
                                        <StatusBadge status={order.orderStatus} />
                                    </div>

                                    {/* Date */}
                                    <div className="col-span-2 hidden md:block">
                                        <p className="text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* Count Footer */}
                <div className="mt-4 text-sm text-gray-400 text-right">
                    Showing {filteredOrders.length} of {orders.length} orders
                </div>

            </div>
        </div>
    );
}

export default AdminAllOrders;
