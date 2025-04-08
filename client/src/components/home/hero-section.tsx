import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Users, Images } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-secondary text-white py-20 overflow-hidden" id="home">
      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-3xl">
          <motion.h1 
            className="text-3xl md:text-5xl font-heading font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Welcome to Tshwane Sporting FC
          </motion.h1>
          
          <motion.p 
            className="text-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Founded in 2020 at the SAPS Training college by Coach Jomo. League champions in our first year of participation.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/players">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                <Users className="mr-2 h-5 w-5" /> View Our Team
              </Button>
            </Link>
            <Link href="/gallery">
              <Button size="lg" variant="secondary" className="bg-white hover:bg-gray-100 text-secondary">
                <Images className="mr-2 h-5 w-5" /> Photo Gallery
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
      
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80" 
          alt="Football field" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Animated soccer ball */}
      <motion.div 
        className="absolute -right-16 -bottom-16 opacity-10 z-0"
        animate={{ 
          rotate: 360,
        }}
        transition={{ 
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-56 h-56 text-white fill-current">
          <path d="M177.1 228.6L207.9 320h96.5l29.62-91.38L256 172.1L177.1 228.6zM255.1 0C114.6 0 .0001 114.6 .0001 256S114.6 512 256 512s255.1-114.6 255.1-255.1S397.4 0 255.1 0zM416.6 360.9l-85.4-1.297l-25.15 81.59C290.1 445.5 273.4 448 256 448s-34.09-2.523-50.09-6.859l-25.15-81.59l-85.4 1.297c-18.12-27.66-29.15-60.27-30.88-95.31L137.8 242.3L106.8 162.7c21.16-26.21 49.09-46.61 81.06-58.84L256 128l68.29-24.3c31.8 12.23 59.9 32.64 81.06 58.84L374.2 242.3l73.41 24.1C446 300.6 434.1 333.2 416.6 360.9z"/>
        </svg>
      </motion.div>
    </section>
  );
}
