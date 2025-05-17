import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";

const Search = () => {
  const [values] = useSearch();

  // Reusable internal styles (equivalent to your CSS)
  const styles = {
    card: {
      width: "18rem",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    cardBody: {
      padding: "15px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    namePrice: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
    },
    cardTitle: {
      fontSize: "16px",
      fontWeight: "600",
    },
    cardPrice: {
      color: "#28a745",
      fontWeight: "bold",
    },
    cardText: {
      color: "#555",
      fontSize: "14px",
      marginBottom: "12px",
      minHeight: "40px",
    },
    cardButtons: {
      display: "flex",
      justifyContent: "space-between",
      gap: "10px",
    },
    btnInfo: {
      flex: 1,
      fontWeight: 600,
      fontSize: "14px",
      padding: "8px 12px",
      borderRadius: "6px",
      backgroundColor: "rgb(19, 204, 19)",
      border: "none",
      color: "white",
    },
    btnDark: {
      flex: 1,
      fontWeight: 600,
      fontSize: "14px",
      padding: "8px 12px",
      borderRadius: "6px",
      backgroundColor: "rgb(255, 230, 0)",
      border: "none",
      color: "black",
    },
  };

  return (
    <Layout title={"Search results"}>
      <div className="container" style={{ padding: "20px 0" }}>
        <div className="text-center">
          <h1>Search Results</h1>
          <h6 style={{ marginBottom: "30px" }}>
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length}`}
          </h6>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              justifyContent: "center",
            }}
          >
            {values?.results.map((p) => (
              <div className="card m-2" style={styles.card} key={p._id}>
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                  style={{ height: "200px", objectFit: "contain" }}
                />
                <div className="card-body" style={styles.cardBody}>
                  <div style={styles.namePrice}>
                    <h5 style={styles.cardTitle}>{p.name}</h5>
                    <p style={styles.cardPrice}>₹{p.price}</p>
                  </div>
                  <p style={styles.cardText}>
                    {p.description?.substring(0, 30)}...
                  </p>
                  <div style={styles.cardButtons}>
                    <button style={styles.btnInfo}>More Details</button>
                    <button style={styles.btnDark}>ADD TO CART</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
