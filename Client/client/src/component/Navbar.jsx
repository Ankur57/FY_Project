import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="flex justify-between items-center text-white p-4 bg-black shadow">

  <div className="flex gap-6">
    <Link to="/">Home</Link>

    {/* User Links */}
    {user && user.role === "user" && (
      <>
        <Link to="/shop">Shop</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">My Orders</Link>
      </>
    )}

    {/* Admin Links */}
    {user && user.role === "admin" && (
      <>
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/products">Products</Link>
        <Link to="/admin/returns">Returns</Link>
      </>
    )}
  </div>

  <div className="flex gap-4 items-center">

    {!user && (
      <>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </>
    )}

    {user && (
      <>
        <span className="text-gray-600">
          {user.role === "admin" ? "Admin" : user.name}
        </span>

        <button
          onClick={handleLogout}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </>
    )}

  </div>

</nav>
      );
  }

export default Navbar;