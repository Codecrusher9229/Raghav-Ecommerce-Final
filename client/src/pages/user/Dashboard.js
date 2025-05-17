import React from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import "../../styles/userDashboard.css";

const Dashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout title={"Dashboard - Ecommerce App"}>
      <div className="container-fluid dashboard-container">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="dashboard-card">
              <h2 className="welcome-msg">Welcome, {auth?.user?.name} 👋</h2>
              <p className="welcome-sub">
                Here's your personal dashboard where you can view and manage
                your account details.
              </p>
              <hr />
              <div className="user-info">
                <p>
                  <strong>Name:</strong> {auth?.user?.name}
                </p>
                <p>
                  <strong>Email:</strong> {auth?.user?.email}
                </p>
                <p>
                  <strong>Contact:</strong> {auth?.user?.phone}
                </p>
                {/* <p><strong>Address:</strong> {auth?.user?.address}</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
