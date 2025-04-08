import { Player } from "@shared/schema";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Calendar, Flag, Award } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

interface PlayerDetailModalProps {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
}

export default function PlayerDetailModal({ player, isOpen, onClose }: PlayerDetailModalProps) {
  const { user } = useAuth();
  const isJunior = player.teamCategory.includes("U-");
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{player.firstName} {player.surname}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Player Photo Column */}
          <div className="flex flex-col items-center justify-start">
            <div className="rounded-lg overflow-hidden border mb-4 w-full max-w-xs aspect-square">
              {player.photoUrl ? (
                <img 
                  src={player.photoUrl}
                  alt={`${player.firstName} ${player.surname}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <User className="h-24 w-24 text-gray-300" />
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-center w-full max-w-xs">
              <div className={`px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                isJunior ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
              }`}>
                {player.teamCategory}
              </div>
              
              <div className={`w-full px-3 py-2 rounded-md text-sm font-medium text-center ${
                player.registrationStatus === "Registered" 
                  ? "bg-green-100 text-green-800" 
                  : player.registrationStatus === "Pending" 
                    ? "bg-yellow-100 text-yellow-800" 
                    : "bg-red-100 text-red-800"
              }`}>
                {player.registrationStatus}
              </div>
            </div>
          </div>
          
          {/* Player Details Column */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center">
                <User className="mr-2 h-5 w-5 text-primary" /> Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <span className="font-medium">Age:</span>
                <span>{player.age} years</span>
                
                <span className="font-medium">Date of Birth:</span>
                <span>{new Date(player.dateOfBirth).toLocaleDateString()}</span>
                
                <span className="font-medium">Nationality:</span>
                <span>{player.nationality}</span>
                
                {player.race && (
                  <>
                    <span className="font-medium">Race:</span>
                    <span>{player.race}</span>
                  </>
                )}
                
                {user ? (
                  <>
                    <span className="font-medium">ID Number:</span>
                    <span>{player.idNumber}</span>
                  </>
                ) : null}
              </div>
            </div>
            
            {/* Football Details */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center">
                <Award className="mr-2 h-5 w-5 text-primary" /> Football Information
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <span className="font-medium">Position:</span>
                <span>{player.position}</span>
                
                <span className="font-medium">Preferred Foot:</span>
                <span>{player.preferredFoot}</span>
                
                {player.safaId && (
                  <>
                    <span className="font-medium">SAFA ID:</span>
                    <span>{player.safaId}</span>
                  </>
                )}
                
                <span className="font-medium">Date Joined:</span>
                <span>{new Date(player.dateJoined).toLocaleDateString()}</span>
              </div>
            </div>
            
            {/* Notes (if any) */}
            {player.notes && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Notes</h3>
                <p className="text-sm text-gray-600">{player.notes}</p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          {!user && (
            <span className="text-sm text-gray-500">
              <Link href="/auth" className="text-primary hover:underline">
                Register or login
              </Link> to see additional player information.
            </span>
          )}
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
