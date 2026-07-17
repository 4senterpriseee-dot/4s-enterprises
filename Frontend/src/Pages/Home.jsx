import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/features/products/components/ProductCard";
import { Link } from "react-router-dom";
import { getAllProducts } from "@/features/products/services/product.api";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        const sorted = (data.products || [])
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);

        setProducts(sorted);
      })
      .catch((error) => {
        console.error("Failed to fetch products", error);
      });
  }, []);

  return (
    <Layout mainClassName="bg-[var(--bg)]">
     <section className="relative h-screen min-h-[600px] w-full">
        <picture>
          {/* mobile */}
          <source
            media="(max-width: 640px)"
            srcSet="https://images.unsplash.com/photo-1554232456-8727aae0cfa4?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=600&q=80&crop=faces"
          />

          {/* tablet */}
          <source
            media="(max-width: 1024px)"
            srcSet="https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=1200&q=80"
          />

          {/* desktop */}
          <img
            src="https://images.unsplash.com/39/lIZrwvbeRuuzqOoWJUEn_Photoaday_CSD%20%281%20of%201%29-5.jpg?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=1800&q=80"
            alt="4senterprises hero"
            className="absolute inset-0 h-full w-full object-cover object-[center_top]"
          />
        </picture>

        {/* Base dim layer */}
        <div className="absolute inset-0 bg-black/35" />
        {/* Stronger gradient behind the text block for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/55" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white sm:px-6">
          <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight text-shadow-hero sm:text-5xl md:text-6xl">
            Premium Corporate Gifting That Leaves a Lasting Impression
          </h1>

          <p className="mt-4 max-w-xl text-sm text-white/80 text-shadow-hero-sm sm:text-base md:text-lg">
            Customized gifts that strengthen relationships, elevate your
            brand, and celebrate every milestone.
          </p>

          <button
            onClick={() =>
              navigate('/products')
            }
            className="mt-6 border border-white px-6 py-2 text-sm text-white transition-colors duration-200 hover:bg-white hover:text-black hover:font-bold hover:rounded-xl cursor-pointer"
          >
            Shop
          </button>
        </div>
      </section>

      <section
        id="products"
        className="mx-auto w-full max-w-[1400px] px-2 sm:px-3 lg:px-4 py-20 text-center"
      >
        <h2 className="mb-10 text-3xl font-bold tracking-tight text-(--text)">
          Latest Drops
        </h2>

        {products?.length ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mx-auto">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="block"
                >
                  <ProductCard product={product} />
                </Link>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate("/products")}
                className="border border-[var(--border)] px-6 py-2 text-sm text-(--text) hover:bg-[var(--card-subtle)] transition"
              >
                View All Products
              </button>
            </div>
          </>
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center space-y-3 text-center">
            <p className="text-sm text-[var(--text-muted)]">No products yet</p>
            <button
              onClick={() => navigate("/seller/create-product")}
              className="border border-[var(--border)] px-5 py-2 text-sm text-(--text) transition-colors duration-200 hover:bg-[var(--card-subtle)]"
            >
              Create Product
            </button>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Home;
