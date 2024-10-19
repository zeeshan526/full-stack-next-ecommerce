import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div className="container">
      <Link href={'/'}>
      <h1>My E-Commerce Store</h1>
      </Link>
        <nav>
          <ul className="navLinks">
            <Link href={'/'}>Home</Link>
            <Link href={'/products'}>Products</Link>
            <Link href={'/category'}>Category</Link>
            <Link href={'/account'}>Account</Link>
            <Link href={'/cart'}>Cart(0)</Link>
          </ul>
        </nav>
      </div>
    </header>
  );
}
