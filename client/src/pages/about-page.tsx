import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar, Flag, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-light">
      {/* Hero Section */}
      <section className="relative bg-secondary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <motion.h1 
              className="text-3xl md:text-5xl font-heading font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Our Club Story
            </motion.h1>
            <motion.p 
              className="text-lg mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Founded in 2020 at the SAPS Training college, we're more than just a football club - we're a community.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1574280439635-1e4634e86825?auto=format&fit=crop&q=80" 
                alt="Team photo" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-heading font-bold mb-6">The Beginning</h2>
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
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium transition duration-300 inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                  Follow us on Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-3">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              At Tshwane Sporting FC, we're guided by a set of core values that shape everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              className="bg-light p-8 rounded-lg text-center hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-primary text-4xl mb-4 flex justify-center">
                <Trophy />
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in everything we do, on and off the pitch.
              </p>
            </motion.div>

            <motion.div 
              className="bg-light p-8 rounded-lg text-center hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-primary text-4xl mb-4 flex justify-center">
                <Users />
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">Community</h3>
              <p className="text-gray-600">
                We're more than a team - we're a family and an integral part of the Tshwane community.
              </p>
            </motion.div>

            <motion.div 
              className="bg-light p-8 rounded-lg text-center hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-primary text-4xl mb-4 flex justify-center">
                <Heart />
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">Passion</h3>
              <p className="text-gray-600">
                We play with heart and passion, giving our all for the beautiful game.
              </p>
            </motion.div>

            <motion.div 
              className="bg-light p-8 rounded-lg text-center hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-primary text-4xl mb-4 flex justify-center">
                <Calendar />
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">Development</h3>
              <p className="text-gray-600">
                We're committed to developing young talent and building for the future.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-3">Our Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From our founding to today, explore the key milestones in our club's history.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>

            {/* Timeline items */}
            <div className="relative z-10">
              {/* 2020 */}
              <motion.div 
                className="mb-16 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg relative">
                  <div className="absolute top-6 -left-3 w-6 h-6 bg-primary rounded-full border-4 border-white transform -translate-x-1/2"></div>
                  <h3 className="text-xl font-bold mb-2 text-primary">2020</h3>
                  <h4 className="text-lg font-medium mb-3">Club Founded</h4>
                  <p className="text-gray-600">
                    Tshwane Sporting FC was established at the SAPS Training College by Coach Jomo with a vision to develop local football talent.
                  </p>
                </div>
              </motion.div>

              {/* 2020 - League Champions */}
              <motion.div 
                className="mb-16 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg relative ml-auto">
                  <div className="absolute top-6 -left-3 w-6 h-6 bg-primary rounded-full border-4 border-white transform -translate-x-1/2"></div>
                  <h3 className="text-xl font-bold mb-2 text-primary">2020</h3>
                  <h4 className="text-lg font-medium mb-3">League Champions</h4>
                  <p className="text-gray-600">
                    In our debut season, we showcased exceptional skill and determination, winning the league in our first year of participation.
                  </p>
                </div>
              </motion.div>

              {/* 2021 */}
              <motion.div 
                className="mb-16 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg relative">
                  <div className="absolute top-6 -left-3 w-6 h-6 bg-primary rounded-full border-4 border-white transform -translate-x-1/2"></div>
                  <h3 className="text-xl font-bold mb-2 text-primary">2021</h3>
                  <h4 className="text-lg font-medium mb-3">Junior Development Program</h4>
                  <p className="text-gray-600">
                    Launch of our youth development program focusing on U-17 and younger age groups to build a sustainable pipeline of talent.
                  </p>
                </div>
              </motion.div>

              {/* 2023 */}
              <motion.div 
                className="mb-16 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg relative ml-auto">
                  <div className="absolute top-6 -left-3 w-6 h-6 bg-primary rounded-full border-4 border-white transform -translate-x-1/2"></div>
                  <h3 className="text-xl font-bold mb-2 text-primary">2023</h3>
                  <h4 className="text-lg font-medium mb-3">Online Presence</h4>
                  <p className="text-gray-600">
                    Launch of our official website to engage with fans and provide information about the club, players, and upcoming events.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">Get In Touch</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Interested in joining the club, becoming a sponsor, or learning more about our activities? We'd love to hear from you!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="secondary" className="bg-white text-primary hover:bg-gray-100">
              Contact Us
            </Button>
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              <Flag className="mr-2 h-4 w-4" />
              Visit Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
