import React from "react";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bottom-0 w-full flex flex-col items-center bg-gray-100 border-t border-gray-300 py-4 space-y-2">
      <div className="flex space-x-2">
        <span className="text-base text-rose-700 font-semibold">
          Made by ❤️
        </span>
        <a
          href="https://asim.weinnovate.net/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 hover:underline text-base font-semibold"
        >
          Asim Ghaffar
        </a>
      </div>
      <div className="flex space-x-6">
        <a
          href="https://www.linkedin.com/in/asim-ghaffar-4a60921b1/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-gray-700 hover:underline text-sm space-x-1"
        >
          <FaLinkedin className="text-blue-600" />
          <span>LinkedIn</span>
        </a>
        <a
          href="mailto:asim.ghaffar71@gmail.com"
          className="flex items-center text-gray-700 hover:underline text-sm space-x-1"
        >
          <FaEnvelope className="text-rose-500" />
          <span>asim.ghaffar71@gmail.com</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
