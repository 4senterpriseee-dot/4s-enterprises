import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Layout from "@/components/layout/Layout";
import { useProduct } from "@/features/products/hooks/useProduct";
import ProductCard from "@/features/products/components/ProductCard";

const SKELETON_COUNT = 8;
const CREATE_PRODUCT_PATH = "/seller/create-product";

const Dashboard = () => {
  const { handleGetSellerProducts } = useProduct();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const sellerProducts = useSelector((state) => state.product.sellerProduct);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        await handleGetSellerProducts();
      } catch (error) {
        console.error("Failed to load seller products", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Layout>
      <div className="mx-auto w-full max-w-7xl">
        <div className="space-y-6">
            {/* Header */}
            <header className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold text-(--text)">
                  Your Products
                </h1>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  Manage and review your listed items
                </p>
              </div>
              <Button
                onClick={() => navigate(CREATE_PRODUCT_PATH)}
                className="bg-[var(--primary-btn)] text-[var(--card)] hover:bg-[var(--primary-hover)]"
              >
                Create Product
              </Button>
            </header>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                  <Card key={`skeleton-${index}`} className="bg-[var(--card)]">
                    <CardContent className="p-3 space-y-3">
                      <Skeleton className="aspect-square w-full rounded-md" />
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-4 w-2/5" />
                      <Skeleton className="h-3 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sellerProducts?.length === 0 ? (
              <Card className="bg-[var(--card)]">
                <CardContent className="flex min-h-[42vh] items-center justify-center p-8 text-center">
                  <div className="space-y-3">
                    <p className="text-sm text-[var(--text-muted)]">
                      No products yet
                    </p>
                    <Button
                      onClick={() => navigate(CREATE_PRODUCT_PATH)}
                      className="bg-[var(--primary-btn)] text-[var(--card)] hover:bg-[var(--primary-hover)]"
                    >
                      Create Product
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sellerProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onClick={() => navigate(`/seller/product/${product._id}/edit`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
    </Layout>
  );
};

export default Dashboard;
