
import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import axios from "axios";
import moment from "moment";
import "../../styles/Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);
  return (
    <Layout title={"Your Orders"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>
            {orders.map((o, i) => {
              return (
                <div className="border shadow">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col">Date</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>{o?.status}</td>
                        <td>{o?.buyer?.name}</td>
                        <td>{moment(o?.createdAt).fromNow()} </td>
                        <td>
                          {o?.payment.success ? "Success" : "Failed"} (
                          {o?.payment.mode})
                        </td>

                        <td>{o?.products?.length}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="container">
                    {o?.products?.map((p, index) => {
                      const product = p?.product;

                      // If product is missing or null (maybe deleted from DB)
                      if (!product) {
                        return (
                          <div
                            className="row mb-2 p-3 card flex-row bg-light"
                            key={`missing-${index}`} // Unique key for missing products
                          >
                            <div className="col-md-12 text-danger">
                              ⚠️ Product not found or deleted
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          className="row mb-2 p-3 card flex-row"
                          key={product._id || `product-${index}`} // Fallback to unique string if no _id
                        >
                          <div className="col-md-4">
                            <img
                              src={`/api/v1/product/product-photo/${product._id}`}
                              className="card-img-top"
                              alt={product.name}
                              style={{
                                width: "180px",
                                height: "200px",
                                objectFit: "contain",
                              }}
                            />
                          </div>
                          <div className="col-md-8">
                            <p>
                              <strong>Name:</strong> {product.name}
                            </p>
                            <p>
                              <strong>Description:</strong>{" "}
                              {product.description}
                            </p>
                            <p>
                              <strong>Price:</strong> ₹{product.price}
                            </p>
                            <p>
                              <strong>Quantity:</strong> {p.quantity}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;