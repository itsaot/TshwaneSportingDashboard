import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

export default function CtaSection() {
  const { user } = useAuth();
  
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.h2 
          className="text-3xl font-heading font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Join Our Community
        </motion.h2>
        
        <motion.p 
          className="text-lg mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Register for an account to get full access to player profiles, exclusive photos, and team updates.
        </motion.p>
        
        <motion.div 
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {!user ? (
            <>
              <Link href="/auth?tab=register">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 font-bold">
                  Register Now
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 font-bold">
                  Learn More
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/players">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 font-bold">
                  Browse Players
                </Button>
              </Link>
              <Link href="/gallery">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 font-bold">
                  View Gallery
                </Button>
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
