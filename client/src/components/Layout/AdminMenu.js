import React from "react";
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  return (
    <>
      <style>{`
        .admin-menu {
          text-align: center;
          padding: 1.5rem;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        }

        .admin-menu h4 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .admin-link {
          display: block;
          margin: 0.5rem auto;
          padding: 0.75rem 1.25rem;
          width: 80%;
          background-color: #f0f0f0;
          color: #333;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .admin-link:hover {
          background-color: #007bff;
          color: #fff;
        }

        .admin-link.active {
          background-color: #007bff;
          color: #fff;
          font-weight: bold;
        }
      `}</style>

      <div className="admin-menu">
        <h4>Admin Panel</h4>
        <NavLink
          to="/dashboard/admin/create-category"
          className={({ isActive }) =>
            isActive ? "admin-link active" : "admin-link"
          }
        >
          Create Category
        </NavLink>
        <NavLink
          to="/dashboard/admin/create-product"
          className={({ isActive }) =>
            isActive ? "admin-link active" : "admin-link"
          }
        >
          Create Product
        </NavLink>
        <NavLink
          to="/dashboard/admin/products"
          className={({ isActive }) =>
            isActive ? "admin-link active" : "admin-link"
          }
        >
          Products
        </NavLink>
        <NavLink
          to="/dashboard/admin/orders"
          className={({ isActive }) =>
            isActive ? "admin-link active" : "admin-link"
          }
        >
          Orders
        </NavLink>
      </div>
    </>
  );
};

export default AdminMenu;
