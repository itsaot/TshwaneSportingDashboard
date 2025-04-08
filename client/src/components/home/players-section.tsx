import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Player } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlayerCard from "@/components/players/player-card";
import PlayerDetailModal from "@/components/players/player-detail-modal";
import { Loader2 } from "lucide-react";

export default function PlayersSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const { data: players, isLoading } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });

  // Take only 4 players for the homepage
  const filteredPlayers = players
    ?.filter(player => selectedCategory ? player.teamCategory === selectedCategory : true)
    ?.slice(0, 4);

  return (
    <section className="py-16 bg-light" id="players">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-heading font-bold mb-3">Our Players</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet the talented individuals who represent Tshwane Sporting FC on the field. Our team consists of both senior players and promising junior talent.
          </p>
        </motion.div>

        {/* Player Category Tabs */}
        <motion.div 
          className="flex justify-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList>
              <TabsTrigger value="">All Players</TabsTrigger>
              <TabsTrigger value="Senior Team">Senior Team</TabsTrigger>
              <TabsTrigger value="U-17 Team">Junior Team</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Players Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredPlayers && filteredPlayers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <PlayerCard 
                  player={player}
                  onClick={() => setSelectedPlayer(player)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No players available at the moment.</p>
          </div>
        )}

        <motion.div 
          className="text-center mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/players">
            <Button className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3">
              View All Players
            </Button>
          </Link>
        </motion.div>

        {/* Player Detail Modal */}
        {selectedPlayer && (
          <PlayerDetailModal
            player={selectedPlayer}
            isOpen={!!selectedPlayer}
            onClose={() => setSelectedPlayer(null)}
          />
        )}
      </div>
    </section>
  );
}
