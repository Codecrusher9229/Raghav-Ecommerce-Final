import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";

const { Option } = Select;

const AdminOrders = () => {
  const [statusOptions] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancel",
  ]);
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-orders");
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        status: newStatus,
      });
      toast.success("Order status updated");
      getOrders();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order status");
    }
  };

  return (
    <Layout title={"All Orders"}>
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center mb-4 fw-bold text-uppercase">
            All Orders
          </h1>

          {orders?.map((order, index) => (
            <div
              className="border rounded-4 shadow-sm mb-5 p-4 bg-white"
              key={order._id}
              style={{ borderLeft: "5px solid #0d6efd" }}
            >
              {/* Order Summary Table */}
              <div className="table-responsive">
                <table className="table table-striped align-middle">
                  <thead className="table-primary">
                    <tr>
                      <th>#</th>
                      <th>Status</th>
                      <th>Buyer</th>
                      <th>Address</th>
                      <th>Date</th>
                      <th>Payment</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{index + 1}</td>
                      <td>
                        <Select
                          bordered={false}
                          className="w-100"
                          onChange={(value) => handleChange(order._id, value)}
                          defaultValue={order?.status}
                        >
                          {statusOptions.map((status, idx) => (
                            <Option key={idx} value={status}>
                              {status}
                            </Option>
                          ))}
                        </Select>
                      </td>
                      <td>{order?.buyer?.name || "N/A"}</td>
                      <td>{order?.buyer?.address || "No address"}</td>
                      <td>{moment(order?.createdAt).fromNow()}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            order?.payment?.success ? "success" : "danger"
                          }`}
                        >
                          {order?.payment?.success ? "Success" : "Failed"}
                        </span>{" "}
                        <small className="text-muted">
                          ({order?.payment?.mode})
                        </small>
                      </td>
                      <td>{order?.products?.length || 0}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Products Section */}
              <div className="mt-4">
                {order?.products?.map((item) => (
                  <div
                    className="row align-items-center g-3 mb-3 p-3 border rounded bg-light"
                    key={item.product._id}
                  >
                    <div className="col-md-3 text-center">
                      <img
                        src={`/api/v1/product/product-photo/${item.product._id}`}
                        alt={item.product.name}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                    </div>
                    <div className="col-md-9">
                      <h5 className="mb-1">{item.product.name}</h5>
                      <p className="text-muted mb-1">
                        {item.product.description?.substring(0, 50) ||
                          "No description"}
                      </p>
                      <p className="fw-semibold text-primary">
                        Price: ₹{item.product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
