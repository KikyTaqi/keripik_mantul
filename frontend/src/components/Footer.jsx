import React from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="w-full mt-4 text-white py-8" style={{ background: "#800000" }}>
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {/* Logo and Slogan */}
        <div className="flex flex-col items-center md:items-start">
          <img
            src="./src/assets/logo_keripik.png"
            alt="Keripik Mantul Logo"
            className="h-16 mb-4"
          />
          <h1 className="font-bold text-lg">Keripik Mantul</h1>
          <p className="text-center md:text-left">
            Camilan Renyah untuk Segala Suasana
          </p>
          {/* Social Media Icons */}
          <div className="flex space-x-4 mt-4">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <FaInstagram size={24} />
            </a>
          </div>
        </div>

        {/* Categories */}
        <div className="text-center md:text-left">
          <h2 className="font-bold text-lg mb-4">Kategori</h2>
          <ul className="space-y-2">
            <li>Keripik Singkong</li>
            <li>Keripik Talas</li>
            <li>Keripik Pisang</li>
            <li>Keripik Balung Kuwuk</li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="text-center md:text-left">
          <h2 className="font-bold text-lg mb-4">Kontak Kami</h2>
          <p>Jl Air Panas No.25 Nglimut</p>
          <p>Gonoharjo Limbangan Kendal</p>
          <p>+62 888-0276-9036</p>
          <p>keripikmantul@gmail.com</p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-400 mt-8 pt-4 text-center">
        <p>© 2024 Keripik Mantul. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
