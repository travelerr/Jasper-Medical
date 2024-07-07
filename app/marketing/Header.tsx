"use client";
import React, { useState } from "react";
import JasperLogo from "../_ui/shared/jasper-logo";
import LoginButton from "./LoginButton";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";

const Header: React.FC = () => {
  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
  return (
    <header className="shadow-lg">
      <nav className="flex items-center justify-between flex-wrap bg-white px-4 py-2">
        <div className="w-25">
          <JasperLogo />
        </div>
        <div className="block lg:hidden">
          <button
            onClick={() => setHamburgerMenuOpen(!hamburgerMenuOpen)}
            data-collapse-toggle="navbar-hamburger"
            type="button"
            className="inline-flex items-center justify-center p-2 w-10 h-10 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-hamburger"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div
            className={`${
              hamburgerMenuOpen ? "" : "hidden"
            } absolute top-0 left-0 h-full w-11/12 bg-white z-20`}
            id="navbar-hamburger"
          >
            <div className="w-full px-4 py-6 flex justify-end border-b">
              <button onClick={() => setHamburgerMenuOpen(false)}>
                <IoMdClose className="w-6 h-6" />
              </button>
            </div>
            <ul className="flex flex-col font-medium px-4">
              <Link
                href="/about"
                className="text-teal-500 hover:text-teal-400 text-2xl my-4 "
              >
                About
              </Link>
              <Link
                href="contact-us"
                className="text-teal-500 hover:text-teal-400 text-2xl my-4"
              >
                Contact Us
              </Link>
              <Link
                href="getting-started"
                className="text-teal-500 hover:text-teal-400 text-2xl my-4"
              >
                Getting Started
              </Link>
            </ul>
            <div className="w-full px-4 py-6 flex justify-center border-t">
              <LoginButton />
            </div>
          </div>
          <div
            className={`${
              hamburgerMenuOpen ? "" : "hidden"
            }offcanvas-backdrop z-10 `}
          ></div>
        </div>
        <div className="w-full hidden flex-grow lg:flex lg:items-center lg:w-auto justify-center">
          <Link
            href="/about"
            className="text-teal-500 hover:text-teal-400 px-2"
          >
            About
          </Link>
          <Link
            href="contact-us"
            className="text-teal-500 hover:text-teal-400 px-2"
          >
            Contact Us
          </Link>
          <Link
            href="getting-started"
            className="text-teal-500 hover:text-teal-400 px-2"
          >
            Getting Started
          </Link>
        </div>
        <div className="hidden lg:block">
          <LoginButton />
        </div>
      </nav>
    </header>
  );
};

export default Header;
