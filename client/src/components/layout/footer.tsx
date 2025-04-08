import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, MapPin, Phone, Mail, Send } from "lucide-react";
import clubLogo from "@/assets/club-logo.jpg";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={clubLogo}
                alt="Tshwane Sporting FC Logo"
                className="h-10 rounded-full"
              />
              <h3 className="text-xl font-heading font-bold">
                Tshwane Sporting FC
              </h3>
            </div>
            <p className="text-gray-400 mb-4">
              Founded in 2020 at the SAPS Training college by Coach Jomo.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://web.facebook.com/p/Tshwane-Sporting-FC-100085997681102/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-primary transition"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-white hover:text-primary transition"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-white hover:text-primary transition"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/players" className="text-gray-400 hover:text-white transition">
                  Players
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-400 hover:text-white transition">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Contact Information</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                <span>SAPS Training College, Pretoria, Tshwane</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                <span>+27 12 345 6789</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                <span>info@tshwanesportingfc.co.za</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to get the latest news and updates.
            </p>
            <form className="flex">
              <Input
                type="email"
                placeholder="Your email"
                className="rounded-r-none text-gray-800"
              />
              <Button type="submit" className="rounded-l-none bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Tshwane Sporting FC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
