import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Facebook } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="py-16 bg-light" id="about">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1574280439635-1e4634e86825?auto=format&fit=crop&q=80" 
              alt="Team photo" 
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-heading font-bold mb-6">Our Club Story</h2>
            <p className="text-gray-700 mb-4">
              Tshwane Sporting FC was founded in 2020 at the SAPS Training college by Coach Jomo with a vision to develop football talent in the Tshwane region. In our debut season, the team showcased exceptional skill and determination.
            </p>
            <p className="text-gray-700 mb-4">
              We went on to win the league in our first year of participation, setting a high standard for the club's future. Unfortunately, we were knocked out during the promotion games, but this has only strengthened our resolve to continue growing and improving.
            </p>
            <p className="text-gray-700 mb-4">
              Today, we focus on both senior and junior development, with dedicated teams for players above 18 years and youth categories including our U-17 squad. Our goal is to nurture local talent while creating a positive community impact through the beautiful game.
            </p>
            <div className="mt-8">
              <a 
                href="https://web.facebook.com/p/Tshwane-Sporting-FC-100085997681102/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  <Facebook className="mr-2 h-5 w-5" /> Follow us on Facebook
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
