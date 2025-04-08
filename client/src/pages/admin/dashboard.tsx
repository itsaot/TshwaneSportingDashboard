import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Users, UserCheck, Images, AlertTriangle, Plus } from "lucide-react";

interface AdminStats {
  totalPlayers: number;
  registeredPlayers: number;
  pendingPlayers: number;
  totalPhotos: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("players");

  const { data: stats, isLoading, error } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
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
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
        <p className="mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-heading font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline">View Website</Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
                  <Users className="text-primary text-xl" />
                </div>
                <div>
                  <p className="text-gray-500">Total Players</p>
                  <h3 className="text-2xl font-bold">{stats?.totalPlayers || 0}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <UserCheck className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500">Registered Players</p>
                  <h3 className="text-2xl font-bold">{stats?.registeredPlayers || 0}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-secondary bg-opacity-10 p-3 rounded-full mr-4">
                  <Images className="text-secondary text-xl" />
                </div>
                <div>
                  <p className="text-gray-500">Gallery Photos</p>
                  <h3 className="text-2xl font-bold">{stats?.totalPhotos || 0}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <AlertTriangle className="text-yellow-600 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500">Pending Registrations</p>
                  <h3 className="text-2xl font-bold">{stats?.pendingPlayers || 0}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="players">Player Management</TabsTrigger>
            <TabsTrigger value="gallery">Gallery Management</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="players">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Player Management</CardTitle>
                    <CardDescription>
                      Add, edit, and manage player profiles.
                    </CardDescription>
                  </div>
                  <Link href="/admin/players">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Manage Players
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-1">Quick Overview</h4>
                    <p className="text-sm text-yellow-700">
                      Currently {stats?.totalPlayers || 0} total players in the system, with {stats?.pendingPlayers || 0} pending registrations.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-1">Senior Team</h4>
                      <p className="text-sm text-gray-600">
                        Manage senior team players (18+ years)
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-1">Junior Teams</h4>
                      <p className="text-sm text-gray-600">
                        Manage junior team players (under 18 years)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gallery Management</CardTitle>
                    <CardDescription>
                      Upload and manage photos in the gallery.
                    </CardDescription>
                  </div>
                  <Link href="/admin/gallery">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Manage Gallery
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-1">Gallery Status</h4>
                    <p className="text-sm text-blue-700">
                      Currently {stats?.totalPhotos || 0} photos uploaded to the gallery.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-1">Match Day Photos</h4>
                      <p className="text-sm text-gray-600">
                        Photos from matches and competitions
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-1">Training Sessions</h4>
                      <p className="text-sm text-gray-600">
                        Photos from team training sessions
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-1">Team Events</h4>
                      <p className="text-sm text-gray-600">
                        Photos from club social events
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Website Settings</CardTitle>
                <CardDescription>
                  Manage website settings and configuration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Coming Soon</h4>
                    <p className="text-sm text-gray-600">
                      Additional settings and configuration options will be available in future updates.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
