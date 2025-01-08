import React from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";

const Header = () => {
  return (
    <div className="flex items-center justify-end px-8 py-4 bg-white">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-red-800" style={{ color: "#800000" }}>Dashboard</h1>
        
      {/* Search Bar */}
      <div className="flex items-center border-solid border rounded-lg ms-5 px-4 py-2 border-red-800">
        <input
          type="text"
          placeholder="Cari ..."
          className="focus:outline-none w-100 font-semibold text-red-800 placeholder-red-800"
        />
        <FaSearch className="text-red-800 ml-10" />
      </div>

      {/* User Icon */}
      <FaUserCircle className="text-red-800 text-3xl object-right" />
    </div>
  );
};

export default Header;
