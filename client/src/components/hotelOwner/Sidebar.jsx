import React from "react";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const sidebarLinks = [
    { name: "Dashboard", path: "/owner", icon: assets.dashboardIcon },
    { name: "Add Room", path: "/owner/add-room", icon: assets.addIcon },
    { name: "List Rooms", path: "/owner/list-room", icon: assets.listIcon },
  ];

  return (
    <div className="w-full md:w-64 border-b md:border-b-0 md:border-r h-auto md:h-full bg-white text-base border-gray-200 flex md:flex-col overflow-x-auto md:overflow-y-auto no-scrollbar transition-all duration-300">
      {sidebarLinks.map((item, index) => (
        <NavLink
          to={item.path}
          key={index}
          end={item.path === "/owner"}
          className={({ isActive }) =>
            `flex items-center py-3 px-6 md:px-8 gap-3 whitespace-nowrap transition-all border-b-2 md:border-b-0 md:border-r-[6px] ${
              isActive
                ? "bg-blue-600/5 border-blue-600 text-blue-600 font-medium"
                : "border-transparent text-gray-600 hover:bg-gray-50"
            }`
          }
        >
          <img
            src={item.icon}
            alt={item.name}
            className="w-5 h-5 md:w-6 md:h-6"
          />
          <p className="text-sm md:text-base">{item.name}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
