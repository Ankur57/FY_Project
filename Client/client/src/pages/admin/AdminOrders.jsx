import { useEffect, useState } from "react";
import axios from "../../api/axios";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [parcelData, setParcelData] = useState({});
    const [creatingShipment, setCreatingShipment] = useState({});
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [shipmentErrors, setShipmentErrors] = useState({});

    const fetchPaidOrders = async () => {
        try {
            const res = await axios.get("/orders/admin/orders?status=paid");
            setOrders(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaidOrders();
    }, []);

    const handleParcelChange = (orderId, field, value) => {
        setParcelData((prev) => ({
            ...prev,
            [orderId]: {
                ...prev[orderId],
                [field]: value,
            },
        }));
    };

    const handleCreateShipment = async (orderId) => {
        const data = parcelData[orderId];
        if (!data?.weight || !data?.length || !data?.breadth || !data?.height) {
            setErrorMsg("Please fill all parcel dimensions (weight, length, breadth, height)");
            setTimeout(() => setErrorMsg(""), 4000);
            return;
        }

        setCreatingShipment((prev) => ({ ...prev, [orderId]: true }));
        setErrorMsg("");
        setShipmentErrors((prev) => ({ ...prev, [orderId]: "" }));

        try {
            await axios.post("/shipments/", {
                orderId,
                weight: parseFloat(data.weight),
                length: parseFloat(data.length),
                breadth: parseFloat(data.breadth),
                height: parseFloat(data.height),
            });

            setSuccessMsg("Shipment created successfully!");
            setTimeout(() => setSuccessMsg(""), 4000);

            // Remove the order from the list
            setOrders((prev) => prev.filter((o) => o._id !== orderId));
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            // Show error both globally and inline on the specific order
            setErrorMsg(`Failed: ${msg}`);
            setShipmentErrors((prev) => ({ ...prev, [orderId]: msg }));
            setTimeout(() => setErrorMsg(""), 6000);
        } finally {
            setCreatingShipment((prev) => ({ ...prev, [orderId]: false }));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 md:p-10">
                <div className="max-w-6xl mx-auto">
                    <div className="h-10 w-64 bg-gray-200 rounded-xl mb-8 animate-pulse" />
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse mb-6" />
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
                        Orders — Ready to Ship
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        Paid orders awaiting shipment. Add parcel details and create shipment.
                    </p>
                </div>

                {/* Alerts */}
                {successMsg && (
                    <div className="mb-6 px-5 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium text-sm flex items-center gap-2 animate-fade-in">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {successMsg}
                    </div>
                )}
                {errorMsg && (
                    <div className="mb-6 px-5 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-medium text-sm flex items-center gap-2">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {errorMsg}
                    </div>
                )}

                {/* No Orders */}
                {orders.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-16 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-700 mb-1">No Paid Orders</h3>
                        <p className="text-gray-400 text-sm">All paid orders have been shipped. Check back later!</p>
                    </div>
                )}

                {/* Orders List */}
                <div className="space-y-6">
                    {orders.map((order) => {
                        const pd = parcelData[order._id] || {};
                        const isCreating = creatingShipment[order._id];

                        return (
                            <div
                                key={order._id}
                                className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                {/* Order Header */}
                                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div>
                                        <h3 className="text-white font-bold text-lg">{order.orderNumber}</h3>
                                        <p className="text-indigo-200 text-sm">
                                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold">
                                            ₹ {order.totalAmount?.toLocaleString("en-IN")}
                                        </span>
                                        <span className="px-3 py-1 bg-emerald-400/20 text-emerald-100 rounded-full text-xs font-bold uppercase tracking-wide">
                                            Paid
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {/* Customer Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Customer</p>
                                            <p className="font-semibold text-gray-800">{order.userId?.name || order.addressSnapshot?.fullName}</p>
                                            <p className="text-sm text-gray-500">{order.userId?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Shipping Address</p>
                                            <p className="text-sm text-gray-700">
                                                {order.addressSnapshot?.addressLine1}, {order.addressSnapshot?.city},{" "}
                                                {order.addressSnapshot?.state} — {order.addressSnapshot?.postalCode}
                                            </p>
                                            <p className="text-sm text-gray-500">{order.addressSnapshot?.mobileNumber}</p>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="mb-5">
                                        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">Items</p>
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            {order.items?.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center py-1.5 text-sm">
                                                    <span className="text-gray-700">{item.name} <span className="text-gray-400">× {item.quantity}</span></span>
                                                    <span className="font-medium text-gray-800">₹ {(item.priceAtTime * item.quantity).toLocaleString("en-IN")}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Parcel Dimensions */}
                                    <div className="border-t border-gray-100 pt-5">
                                        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3">
                                            📦 Parcel Details
                                        </p>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            <div>
                                                <label className="text-xs text-gray-500 font-medium block mb-1">Weight (kg)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0.01"
                                                    placeholder="0.5"
                                                    value={pd.weight || ""}
                                                    onChange={(e) => handleParcelChange(order._id, "weight", e.target.value)}
                                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 font-medium block mb-1">Length (cm)</label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    min="1"
                                                    placeholder="10"
                                                    value={pd.length || ""}
                                                    onChange={(e) => handleParcelChange(order._id, "length", e.target.value)}
                                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 font-medium block mb-1">Breadth (cm)</label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    min="1"
                                                    placeholder="10"
                                                    value={pd.breadth || ""}
                                                    onChange={(e) => handleParcelChange(order._id, "breadth", e.target.value)}
                                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 font-medium block mb-1">Height (cm)</label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    min="1"
                                                    placeholder="10"
                                                    value={pd.height || ""}
                                                    onChange={(e) => handleParcelChange(order._id, "height", e.target.value)}
                                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleCreateShipment(order._id)}
                                            disabled={isCreating}
                                            className={`mt-4 w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm text-white transition-all duration-300 flex items-center justify-center gap-2 ${isCreating
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5"
                                                }`}
                                        >
                                            {isCreating ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Creating...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                                    </svg>
                                                    Create Shipment
                                                </>
                                            )}
                                        </button>

                                        {/* Per-order shipment error */}
                                        {shipmentErrors[order._id] && (
                                            <div className="mt-3 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
                                                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                <div>
                                                    <p className="font-semibold">Shipment creation failed</p>
                                                    <p className="mt-0.5">{shipmentErrors[order._id]}</p>
                                                </div>
                                                <button
                                                    onClick={() => setShipmentErrors((prev) => ({ ...prev, [order._id]: "" }))}
                                                    className="ml-auto text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                                                    title="Dismiss"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}

export default AdminOrders;
