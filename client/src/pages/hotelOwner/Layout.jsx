import React from "react";
import Navbar from "../../components/hotelOwner/Navbar";
import Sidebar from "../../components/hotelOwner/Sidebar";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";

const Layout = () => {
  const { isOwner, navigate } = useAppContext();

  useEffect(() => {
    if (!isOwner) {
      navigate("/");
    }
  }, [isOwner, navigate]);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-6 md:p-10 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
