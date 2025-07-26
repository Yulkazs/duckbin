// components/Footer.tsx
"use client";

import { PiCoffeeBold } from "react-icons/pi";

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  className = ""
}) => {
  return (
    <footer className={`w-full py-6 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-[1216px] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          {/* Left side - Copyright */}
          <div className="flex items-center">
            <span 
              className="text-sm font-normal transition-colors duration-200"
              style={{ color: '#42434E' }}
            >
              © 2025, Yulkaz
            </span>
          </div>

          {/* Right side - Links */}
          <div className="flex items-center gap-6">
            <a 
              href="/terms" 
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: '#42434E' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#848489';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#42434E';
              }}
            >
              Terms & Privacy
            </a>
            <a 
              href="https://coff.ee/yulkaz" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium transition-colors duration-200"
              style={{ color: '#42434E' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#848489';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#42434E';
              }}
            >
              Buy a Coffee 
              <span className="text-base"><PiCoffeeBold /></span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;