import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { Badge } from "antd";
import "../../styles/Header.css"; 

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold text-primary fs-4">
          🛒 Ecommerce App
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item mx-2">
              <SearchInput />
            </li>

            <li className="nav-item mx-2">
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
            </li>

            <li className="nav-item dropdown mx-2">
              <Link
                className="nav-link dropdown-toggle"
                to="/categories"
                data-bs-toggle="dropdown"
              >
                Categories
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/categories">
                    All Categories
                  </Link>
                </li>
                {categories?.map((c) => (
                  <li key={c._id}>
                    <Link className="dropdown-item" to={`/category/${c.slug}`}>
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {!auth?.user ? (
              <>
                <li className="nav-item mx-2">
                  <NavLink to="/register" className="nav-link">
                    Register
                  </NavLink>
                </li>
                <li className="nav-item mx-2">
                  <NavLink to="/login" className="nav-link">
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown mx-2">
                <NavLink
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  {auth?.user?.name}
                </NavLink>
                <ul className="dropdown-menu">
                  <li>
                    <NavLink
                      to={`/dashboard/${
                        auth?.user?.role === 1 ? "admin" : "user"
                      }`}
                      className="dropdown-item"
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={handleLogout}
                      to="/login"
                      className="dropdown-item"
                    >
                      Logout
                    </NavLink>
                  </li>
                </ul>
              </li>
            )}

            <li className="nav-item mx-2">
              <NavLink to="/cart" className="nav-link position-relative">
                <Badge count={cart?.length} showZero offset={[5, -5]}>
                  <span>Cart</span>
                </Badge>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
