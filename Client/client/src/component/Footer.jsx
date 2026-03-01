import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/soandita-logo.png";

/* Accordion section – visible only on mobile */
function AccordionSection({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-700 md:border-none">
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-4 md:hidden text-white font-semibold text-sm tracking-wider uppercase"
      >
        {title}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Desktop heading */}
      <h3 className="hidden md:block text-white font-semibold text-lg mb-4">
        {title}
      </h3>

      {/* Links – always visible on md+, toggled on mobile */}
      <ul
        className={`flex flex-col gap-2.5 overflow-hidden transition-all duration-300 ${open ? "max-h-96 pb-4" : "max-h-0 md:max-h-none"
          }`}
      >
        {children}
      </ul>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-12">
        {/* Desktop: 4-col grid  |  Mobile: stacked accordions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:gap-10">
          {/* Logo & Description — shown at bottom on mobile, top-left on desktop */}
          <div className="hidden md:flex flex-col gap-4 order-1">
            <img
              src={logo}
              alt="Soandita Jewels"
              className="w-44 object-contain brightness-0 invert"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover timeless elegance and exceptional craftsmanship. Shop now
              and let your style shine with Soandita Jewels.
            </p>
          </div>

          {/* Menu */}
          <div className="order-2">
            <AccordionSection title="Categories">
              <li>
                <Link
                  to="/shop?category=new"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  New in
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=ring"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Ring
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=necklace"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Necklace
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=earrings"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Earrings
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=gift"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Gift
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  About
                </Link>
              </li>
            </AccordionSection>
          </div>

          {/* About */}
          <div className="order-3">
            <AccordionSection title="Information">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/919140652844?text=Hi%20Soandita%20Jewels!%20I%20have%20a%20query."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Us
                </a>
              </li>
            </AccordionSection>
          </div>

          {/* Social */}
          <div className="order-4">
            <AccordionSection title="Social">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  X
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  LinkedIn
                </a>
              </li>
            </AccordionSection>
          </div>

          {/* Logo on mobile — shown below the accordions */}
          <div className="flex md:hidden flex-col items-start gap-3 pt-6 order-5">
            <img
              src={logo}
              alt="Soandita Jewels"
              className="w-36 object-contain brightness-0 invert"
            />
            <p className="text-gray-400 text-xs leading-relaxed">
              Discover timeless elegance and exceptional craftsmanship.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-xs">
            © 2026 Soandita Jewels. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/"
              className="text-gray-400 hover:text-white transition-colors text-xs"
            >
              Privacy Policy
            </Link>
            <Link
              to="/"
              className="text-gray-400 hover:text-white transition-colors text-xs"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              to="/"
              className="text-gray-400 hover:text-white transition-colors text-xs"
            >
              Return &amp; Exchange
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;