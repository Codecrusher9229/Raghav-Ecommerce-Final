import React, { useEffect, useState } from "react";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";
import { Link } from "react-router-dom";
import "../styles/CategoryProductStyles.css";
const Categories = () => {
  const categories = useCategory();
  return (
    <Layout title={"All Categories"}>
      <div className="container py-4">
        <h1 className="text-center mb-4 fw-bold text-primary">
          Browse Categories
        </h1>
        <div className="row justify-content-center">
          {categories.map((c) => (
            <div className="col-md-4 col-sm-6 mb-4" key={c._id}>
              <Link
                to={`/category/${c.slug}`}
                className="category-btn btn btn-outline-primary w-100 py-3 fs-5"
              >
                {c.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
