import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/layout/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router";

const DEFAULT_MAIN_CLASS = "min-h-screen bg-[var(--bg)] px-4 py-6 sm:px-6";

const Layout = ({ children, mainClassName = DEFAULT_MAIN_CLASS }) => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <main className={mainClassName}>
        <div className={isHome ? "" : "pt-20 md:pt-24"}>{children}</div>
      </main>
      <Footer />
    </>
  );
};

export default Layout;
