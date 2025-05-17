import React, { useState } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const navigate = useNavigate();

  const styles = {
    card: {
      display: "flex",
      flexDirection: "row",
      marginBottom: "1rem",
      padding: "1rem",
      border: "1px solid #ddd",
      borderRadius: "5px",
      alignItems: "center",
    },
    // img: {
    //   width: "100px",
    //   height: "200px",
    //   objectFit: "contain",
    // },
    cartSummary: {
      textAlign: "center",
      border: "1px solid #ccc",
      padding: "1rem",
      borderRadius: "5px",
    },
    addressBox: {
      marginBottom: "1rem",
    },
    paymentButton: {
      marginTop: "1rem",
    },
  };

  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        total += item.price;
      });
      return total.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalAmount = () => {
    let total = 0;
    cart?.forEach((item) => {
      total += item.price;
    });
    return total;
  };

  const removeCartItem = (pid) => {
    try {
      const updatedCart = cart.filter((item) => item._id !== pid);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.log(error);
    }
  };

  const handleCODPayment = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/v1/product/cod/order", { cart });
      setLoading(false);
      setCart([]);
      localStorage.removeItem("cart");
      toast.success("Order Placed Successfully");
      navigate("/dashboard/user/orders");
    } catch (error) {
      console.log(error);
      toast.error("COD Order Failed");
      setLoading(false);
    }
  };

  const handleOnlinePayment = async () => {
    try {
      setLoading(true);
      const {
        data: { order },
      } = await axios.post("/api/v1/product/razorpay/order", {
        amount: getTotalAmount() * 100,
        cart,
      });
      const options = {
        key: "rzp_test_5YEO0GfgViaAGd",
        amount: order.amount,
        currency: "INR",
        name: "E-Commerce App By Raghav",
        description: "Purchase Description",
        order_id: order.id,
        handler: async function (response) {
          try {
            const res = await axios.post("/api/v1/product/razorpay/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              cart,
            });
            setLoading(false);
            setCart([]);
            localStorage.removeItem("cart");
            toast.success("Payment Successful");
            navigate("/dashboard/user/orders");
          } catch (err) {
            console.log(err);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: auth?.user?.name,
          email: auth?.user?.email,
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Payment initialization failed");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {`Hello ${auth?.token && auth?.user?.name}`}
            </h1>
            <h4 className="text-center">
              {cart?.length
                ? `You have ${cart.length} items in your cart`
                : "Your Cart is Empty"}
            </h4>
          </div>
        </div>

        <div className="row">
          <div className="col-md-8">
            {cart?.map((p) => (
              <div className="row mb-2 p-3 card flex-row" key={p._id}>
                <div className="col-md-4">
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    alt={p.name}
                    style={{
                      width: "180px",
                      height: "200px",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div className="col-md-8">
                  <p>{p.name}</p>
                  <p>{p.description?.substring(0, 30)}</p>
                  <p>Price : ₹{p.price}</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeCartItem(p._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-4">
            <div style={styles.cartSummary}>
              <h2>Cart Summary</h2>
              <h4>Total : {totalPrice()}</h4>

              {auth?.user?.address ? (
                <div style={styles.addressBox}>
                  <h5>Current Address</h5>
                  <p>{auth?.user?.address}</p>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-outline-warning"
                  onClick={() => navigate("/login", { state: "/cart" })}
                >
                  Please Login to checkout
                </button>
              )}

              <div className="mb-3">
                <h5>Select Payment Method</h5>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <label className="form-check-label">
                    Cash on Delivery (COD)
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                  />
                  <label className="form-check-label">
                    Pay Online (Razorpay)
                  </label>
                </div>
              </div>

              {paymentMethod === "cod" && (
                <button
                  className="btn btn-primary"
                  onClick={handleCODPayment}
                  disabled={loading || !auth?.user?.address}
                  style={styles.paymentButton}
                >
                  {loading ? "Placing Order..." : "Place Order (COD)"}
                </button>
              )}

              {paymentMethod === "online" && (
                <button
                  className="btn btn-primary"
                  onClick={handleOnlinePayment}
                  disabled={loading || !auth?.user?.address}
                  style={styles.paymentButton}
                >
                  {loading ? "Processing Payment..." : "Pay Now (Razorpay)"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
