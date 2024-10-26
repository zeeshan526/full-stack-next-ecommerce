'use client'
import { useContext, useState } from "react";
import Link from "next/link";
import { CartContext } from "./CartContext";

export default function Header() {
    const {cartProducts} = useContext(CartContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link href={'/'}>
          <h1 className="text-2xl font-bold">My E-Commerce Store</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link href={'/'}>Home</Link>
          <Link href={'/shop'}>Shop</Link>
          <Link href={'/category'}>Category</Link>
          <Link href={'account'}>Account</Link>
          <Link href={'/cart'}>Cart ({cartProducts.length})</Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <nav className="flex flex-col space-y-2 px-6 py-4">
            <Link href={'/'}>Home</Link>
            <Link href={'/products'}>Products</Link>
            <Link href={'/category'}>Category</Link>
            <Link href={'/account'}>Account</Link>
            <Link href={'/cart'}>Cart(0)</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
