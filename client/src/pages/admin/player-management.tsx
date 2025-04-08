import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Player } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Plus, Edit, Trash2, Eye, ArrowLeft, Loader2, User } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import PlayerForm from "@/components/admin/player-form";

export default function PlayerManagement() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [viewingPlayer, setViewingPlayer] = useState<Player | null>(null);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
  const { toast } = useToast();

  const { data: players, isLoading, error } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/players/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      toast({
        title: "Player deleted",
        description: "The player has been successfully deleted.",
        variant: "default",
      });
      setPlayerToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete player: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const filteredPlayers = players?.filter(player => {
    const matchesCategory = selectedCategory === "All" ? true : player.teamCategory === selectedCategory;
    const matchesSearch = searchQuery
      ? player.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.position.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

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

  return (
    <div className="bg-light min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-heading font-bold">Player Management</h1>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsAddPlayerOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Player
            </Button>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Players</SelectItem>
                <SelectItem value="Senior Team">Senior Team</SelectItem>
                <SelectItem value="U-17 Team">U-17 Team</SelectItem>
                <SelectItem value="U-15 Team">U-15 Team</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search players..."
              className="pl-10 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Players Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableCaption>
                {filteredPlayers && filteredPlayers.length > 0
                  ? `Showing ${filteredPlayers.length} of ${players?.length} players`
                  : "No players found matching your criteria"}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead>Age/Team</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Reg. Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers && filteredPlayers.length > 0 ? (
                  filteredPlayers.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 mr-4">
                            {player.photoUrl ? (
                              <img 
                                className="h-10 w-10 rounded-full object-cover" 
                                src={player.photoUrl} 
                                alt={`${player.firstName} ${player.surname}`}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="h-6 w-6 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {player.firstName} {player.surname}
                            </div>
                            <div className="text-sm text-gray-500">ID: {player.idNumber}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">{player.age} years</div>
                        <div className="text-sm text-gray-500">{player.teamCategory}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">{player.position}</div>
                        <div className="text-sm text-gray-500">{player.preferredFoot} Foot</div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${player.registrationStatus === "Registered" 
                            ? "bg-green-100 text-green-800" 
                            : player.registrationStatus === "Pending" 
                              ? "bg-yellow-100 text-yellow-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                          {player.registrationStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setViewingPlayer(player)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setEditingPlayer(player)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setPlayerToDelete(player)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-gray-500">No players found matching your criteria</p>
                      <Button 
                        variant="link" 
                        onClick={() => {
                          setSelectedCategory("All");
                          setSearchQuery("");
                        }}
                      >
                        Clear filters
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add/Edit Player Dialog */}
        <Dialog open={isAddPlayerOpen} onOpenChange={setIsAddPlayerOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Player</DialogTitle>
              <DialogDescription>
                Fill in the player details below to add them to the team.
              </DialogDescription>
            </DialogHeader>
            <PlayerForm 
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ["/api/players"] });
                toast({
                  title: "Success",
                  description: "Player added successfully",
                  variant: "default",
                });
                setIsAddPlayerOpen(false);
              }}
              onCancel={() => setIsAddPlayerOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Player Dialog */}
        <Dialog 
          open={!!editingPlayer} 
          onOpenChange={(open) => !open && setEditingPlayer(null)}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Player</DialogTitle>
              <DialogDescription>
                Update player information.
              </DialogDescription>
            </DialogHeader>
            {editingPlayer && (
              <PlayerForm 
                player={editingPlayer}
                onSuccess={() => {
                  queryClient.invalidateQueries({ queryKey: ["/api/players"] });
                  toast({
                    title: "Success",
                    description: "Player updated successfully",
                    variant: "default",
                  });
                  setEditingPlayer(null);
                }}
                onCancel={() => setEditingPlayer(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* View Player Dialog */}
        <Dialog 
          open={!!viewingPlayer} 
          onOpenChange={(open) => !open && setViewingPlayer(null)}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Player Details</DialogTitle>
            </DialogHeader>
            {viewingPlayer && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center">
                  {viewingPlayer.photoUrl ? (
                    <img 
                      src={viewingPlayer.photoUrl} 
                      alt={`${viewingPlayer.firstName} ${viewingPlayer.surname}`} 
                      className="h-48 w-48 object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="h-48 w-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                      <User className="h-24 w-24 text-gray-400" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold">
                    {viewingPlayer.firstName} {viewingPlayer.surname}
                  </h3>
                  <p className="text-gray-500 mb-2">{viewingPlayer.position}</p>
                  <div className="flex items-center mt-2">
                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                      ${viewingPlayer.registrationStatus === "Registered" 
                        ? "bg-green-100 text-green-800" 
                        : viewingPlayer.registrationStatus === "Pending" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                      {viewingPlayer.registrationStatus}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-500 mb-1">Personal Information</h4>
                    <div className="grid grid-cols-2 gap-y-2">
                      <div className="text-sm font-medium">Age:</div>
                      <div className="text-sm">{viewingPlayer.age} years</div>
                      <div className="text-sm font-medium">Date of Birth:</div>
                      <div className="text-sm">{new Date(viewingPlayer.dateOfBirth).toLocaleDateString()}</div>
                      <div className="text-sm font-medium">ID Number:</div>
                      <div className="text-sm">{viewingPlayer.idNumber}</div>
                      <div className="text-sm font-medium">Nationality:</div>
                      <div className="text-sm">{viewingPlayer.nationality}</div>
                      {viewingPlayer.race && (
                        <>
                          <div className="text-sm font-medium">Race:</div>
                          <div className="text-sm">{viewingPlayer.race}</div>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-500 mb-1">Football Information</h4>
                    <div className="grid grid-cols-2 gap-y-2">
                      <div className="text-sm font-medium">Team Category:</div>
                      <div className="text-sm">{viewingPlayer.teamCategory}</div>
                      <div className="text-sm font-medium">Position:</div>
                      <div className="text-sm">{viewingPlayer.position}</div>
                      <div className="text-sm font-medium">Preferred Foot:</div>
                      <div className="text-sm">{viewingPlayer.preferredFoot}</div>
                      {viewingPlayer.safaId && (
                        <>
                          <div className="text-sm font-medium">SAFA ID:</div>
                          <div className="text-sm">{viewingPlayer.safaId}</div>
                        </>
                      )}
                      <div className="text-sm font-medium">Date Joined:</div>
                      <div className="text-sm">{new Date(viewingPlayer.dateJoined).toLocaleDateString()}</div>
                    </div>
                  </div>
                  {viewingPlayer.notes && (
                    <div>
                      <h4 className="font-semibold text-gray-500 mb-1">Notes</h4>
                      <p className="text-sm">{viewingPlayer.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button onClick={() => {
                setEditingPlayer(viewingPlayer);
                setViewingPlayer(null);
              }}>
                Edit Player
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog 
          open={!!playerToDelete} 
          onOpenChange={(open) => !open && setPlayerToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete {playerToDelete?.firstName} {playerToDelete?.surname}'s profile and all associated data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  if (playerToDelete) {
                    deleteMutation.mutate(playerToDelete.id);
                  }
                }}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Player"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
