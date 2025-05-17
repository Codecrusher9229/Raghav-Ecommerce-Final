import React from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import "../../styles/adminDashboard.css"; // ⬅ import the new style

const AdminDashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout title={"Admin Dashboard - Ecommerce App"}>
      <div className="dashboard-container">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="dashboard-card w-100">
              <h2 className="welcome-msg">Welcome, {auth?.user?.name} 👋</h2>
              <p className="welcome-sub">
                This is your admin dashboard where you can manage categories,
                products, and orders.
              </p>
              <div className="admin-info">
                <p>
                  <strong>Name:</strong> {auth?.user?.name}
                </p>
                <p>
                  <strong>Email:</strong> {auth?.user?.email}
                </p>
                <p>
                  <strong>Contact:</strong> {auth?.user?.phone}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
