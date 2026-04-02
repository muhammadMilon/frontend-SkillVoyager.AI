import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  const { pathname } = useLocation();

  // Hide Navbar only on admin dashboard page
  const hideNavbar = pathname === "/admin-dashboard";

  return (
    <div className="flex flex-col min-h-screen transition-colors">
      {!hideNavbar && <Navbar />}

      <main className="flex-grow min-h-screen relative">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
