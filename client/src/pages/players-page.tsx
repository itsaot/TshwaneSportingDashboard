import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Player } from "@shared/schema";
import { Button } from "@/components/ui/button";
import PlayerCard from "@/components/players/player-card";
import PlayerDetailModal from "@/components/players/player-detail-modal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, User, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export default function PlayersPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const { user } = useAuth();

  const { data: players, isLoading, error } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });

  const filteredPlayers = players?.filter(player => {
    const matchesCategory = selectedCategory ? player.teamCategory === selectedCategory : true;
    const matchesSearch = searchQuery
      ? player.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.position.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  // Group players by team category
  const seniorPlayers = players?.filter(player => player.teamCategory.includes("Senior"));
  const juniorPlayers = players?.filter(player => player.teamCategory.includes("U-"));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Players</h2>
        <p className="mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  // If no players and user is authenticated, show a message
  if ((!players || players.length === 0) && user?.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">No Players Found</h2>
        <p className="mb-8">No players have been added to the database yet.</p>
        <Link href="/admin/players">
          <Button>Add Players</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-16 bg-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-heading font-bold mb-3">Our Players</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet the talented individuals who represent Tshwane Sporting FC on the field. Our team consists of both senior players and promising junior talent.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList>
              <TabsTrigger value="">All Players</TabsTrigger>
              <TabsTrigger value="Senior Team">Senior Team</TabsTrigger>
              <TabsTrigger value="U-17 Team">Junior Team</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search players..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Player Counts */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <User className="text-primary" size={16} />
              <span>Total: {players?.length || 0} players</span>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <User className="text-secondary" size={16} />
              <span>Senior: {seniorPlayers?.length || 0} players</span>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <User className="text-secondary" size={16} />
              <span>Junior: {juniorPlayers?.length || 0} players</span>
            </div>
          </div>
        </div>

        {/* Players Grid */}
        {filteredPlayers && filteredPlayers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPlayers.map((player) => (
              <PlayerCard 
                key={player.id} 
                player={player}
                onClick={() => setSelectedPlayer(player)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg text-center">
            <h3 className="text-xl font-medium mb-2">No Players Found</h3>
            <p className="text-gray-500">
              {searchQuery 
                ? `No players match "${searchQuery}" in the ${selectedCategory || "selected"} category.` 
                : `No players found in the ${selectedCategory || "selected"} category.`}
            </p>
          </div>
        )}

        {/* Player Detail Modal */}
        {selectedPlayer && (
          <PlayerDetailModal
            player={selectedPlayer}
            isOpen={!!selectedPlayer}
            onClose={() => setSelectedPlayer(null)}
          />
        )}
      </div>
    </div>
  );
}
