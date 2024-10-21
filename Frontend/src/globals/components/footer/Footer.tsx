import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <footer className="bg-gray-100 flex flex-col space-y-10 justify-center">
        <nav className="flex justify-center flex-wrap gap-6 text-gray-500 font-medium mt-5">
          <Link className="hover:text-gray-900" to="/">
            Home
          </Link>
          <Link className="hover:text-gray-900" to="/cart">
            Carts
          </Link>
          <Link className="hover:text-gray-900" to="#">
            Services
          </Link>
          <Link className="hover:text-gray-900" to="#">
            Media
          </Link>
          <Link className="hover:text-gray-900" to="#">
            Gallery
          </Link>
          <Link className="hover:text-gray-900" to="#">
            Contact
          </Link>
        </nav>

        <div className="flex justify-center space-x-5">
          <Link
            to="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="https://img.icons8.com/fluent/30/000000/facebook-new.png" />
          </Link>
          <Link
            to="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="https://img.icons8.com/fluent/30/000000/linkedin-2.png" />
          </Link>
          <Link
            to="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="https://img.icons8.com/fluent/30/000000/instagram-new.png" />
          </Link>
          <Link
            to="https://messenger.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="https://img.icons8.com/fluent/30/000000/facebook-messenger--v2.png" />
          </Link>
          <Link
            to="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="https://img.icons8.com/fluent/30/000000/twitter.png" />
          </Link>
        </div>
        <p className="text-center text-gray-700 font-medium">
          &copy; 2022 Company Ltd. All rights reserved.
        </p>
      </footer>
    </>
  );
}
