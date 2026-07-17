import { createBrowserRouter, Outlet } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import EditProduct from "../features/products/pages/EditProduct";
import AllProducts from "../features/products/pages/AllProducts";

import Protected from "@/features/auth/components/Protected";
import ProductDetail from "@/features/products/pages/ProductDetail";
import SellerProductDetail from "@/features/products/pages/SellerProductDetail";
import Cart from "@/features/cart/pages/Cart";
import Home from "@/Pages/Home";
import Dashboard from "@/Pages/Dashboard";
import Orders from "@/features/cart/pages/Orders";
import OrderSuccess from "@/features/cart/pages/OrderSuccess";
import OrderDetails from "@/features/cart/pages/OrderDetails";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/products",
    element: <AllProducts />,
  },
  {
    path: "/product/:productId",
    element: <ProductDetail />,
  },
  {
    path: "/cart",
    element: (
      <Protected>
        <Cart />
      </Protected>
    ),
  },
  {
    path: "/orders",
    element: (
      <Protected>
        <Orders />
      </Protected>
    ),
  },
  {
    path: "/order-success/:orderId",
    element: <OrderSuccess />,
  },
  {
    path: "/orders/:orderId",
    element: (
      <Protected>
        <OrderDetails />
      </Protected>
    ),
  },
  {
    path: "/seller",
    element: (
      <Protected role="seller">
        <Outlet />
      </Protected>
    ),
    children: [
      {
        path: "create-product",
        element: <CreateProduct />,
      },
      {
        path: "product/:id/edit",
        element: <EditProduct />,
      },
      {
        path: "dashboard",
        element: <Dashboard/>,
      },
      {
        path: "product/:productId",
        element: <SellerProductDetail />,
      },
    ],
  },
]);

