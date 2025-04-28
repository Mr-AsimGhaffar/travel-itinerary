import React from "react";

const Footer = () => {
  return (
    <footer className="bottom-0 w-full flex justify-center space-x-2 bg-gray-100 border-t border-gray-300 py-4">
      <a className="text-base text-rose-700 font-semibold">Made by ❤️ </a>
      <a
        href="https://asim.weinnovate.net/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-800 hover:underline text-base font-semibold"
      >
        Asim Ghaffar
      </a>
    </footer>
  );
};

export default Footer;
