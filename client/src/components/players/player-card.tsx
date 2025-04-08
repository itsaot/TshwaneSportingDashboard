import { Player } from "@shared/schema";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface PlayerCardProps {
  player: Player;
  onClick: () => void;
}

export default function PlayerCard({ player, onClick }: PlayerCardProps) {
  const isJunior = player.teamCategory.includes("U-");
  
  return (
    <motion.div 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300"
      whileHover={{ y: -5 }}
    >
      <div className="relative pt-[100%]">
        {player.photoUrl ? (
          <img 
            src={player.photoUrl}
            alt={`${player.firstName} ${player.surname}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center">
            <User className="h-16 w-16 text-gray-400" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <span 
            className={`inline-block text-white text-xs px-2 py-1 rounded ${
              isJunior ? "bg-secondary" : "bg-primary"
            }`}
          >
            {player.teamCategory}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-heading font-bold text-lg">{player.firstName} {player.surname}</h3>
        <div className="flex justify-between text-sm text-gray-600 mb-3">
          <span>Age: {player.age}</span>
          <span>Position: {player.position}</span>
        </div>
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white"
          onClick={onClick}
        >
          View Profile
        </Button>
      </div>
    </motion.div>
  );
}
