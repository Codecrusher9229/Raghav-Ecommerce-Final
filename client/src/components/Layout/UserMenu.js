import React from "react";
import { NavLink } from "react-router-dom";

const UserMenu = () => {
  return (
    <>
      <style>{`
        .admin-menu {
          text-align: center;
          padding: 1.5rem;
          background-color: #ffffff;
          border-radius: 12px;
          margin-top:20px;
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
        <h4>User Panel</h4>
        <NavLink
          to="/dashboard/user/orders"
          className={({ isActive }) =>
            isActive ? "admin-link active" : "admin-link"
          }
        >
          Orders
        </NavLink>
        <NavLink
          to="/dashboard/user/profile"
          className={({ isActive }) =>
            isActive ? "admin-link active" : "admin-link"
          }
        >
          Profile
        </NavLink>
      </div>
    </>
  );
};

export default UserMenu;
