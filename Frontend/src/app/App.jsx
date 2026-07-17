import { RouterProvider } from "react-router";
import { routes } from "./app.routes";
import { useAuth } from "@/features/auth/hooks/useAuth";
import "./App.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { handleGetMe } = useAuth();

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      handleGetMe().catch((error) => {
        console.error("Failed to fetch user data", error);
      });
    }
  }, []);

  return (
    <>
      <RouterProvider router={routes} />
      <Toaster
        position="top-right"
        containerStyle={{
          top: "80px",
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--card)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "white",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "white",
            },
          },
        }}
      />
    </>
  );
};

export default App;
