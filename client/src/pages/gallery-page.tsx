import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Photo } from "@shared/schema";
import { Button } from "@/components/ui/button";
import GalleryItem from "@/components/gallery/gallery-item";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Image, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const { user } = useAuth();

  const { data: photos, isLoading, error } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
  });

  const filteredPhotos = photos?.filter(photo => {
    const matchesCategory = selectedCategory ? photo.category === selectedCategory : true;
    const matchesSearch = searchQuery
      ? photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (photo.description && photo.description.toLowerCase().includes(searchQuery.toLowerCase()))
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
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Gallery</h2>
        <p className="mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  // If no photos and user is authenticated and admin, show a message
  if ((!photos || photos.length === 0) && user?.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">No Photos Found</h2>
        <p className="mb-8">No photos have been added to the gallery yet.</p>
        <Link href="/admin/gallery">
          <Button>Add Photos</Button>
        </Link>
      </div>
    );
  }

  // If no photos and user is not authenticated, show a message to log in
  if ((!photos || photos.length === 0) && !user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Gallery Access</h2>
        <p className="mb-8">Please log in or register to view the full gallery.</p>
        <div className="flex justify-center gap-4">
          <Link href="/auth">
            <Button variant="default">Login</Button>
          </Link>
          <Link href="/auth?tab=register">
            <Button variant="outline">Register</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-heading font-bold mb-3">Photo Gallery</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Capturing the defining moments of our club both on and off the pitch.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList>
              <TabsTrigger value="">All Photos</TabsTrigger>
              <TabsTrigger value="Match Days">Match Days</TabsTrigger>
              <TabsTrigger value="Training">Training</TabsTrigger>
              <TabsTrigger value="Team Events">Team Events</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search gallery..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredPhotos && filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <GalleryItem 
                key={photo.id} 
                photo={photo}
                onClick={() => setSelectedPhoto(photo)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <h3 className="text-xl font-medium mb-2">No Photos Found</h3>
            <p className="text-gray-500">
              {searchQuery 
                ? `No photos match "${searchQuery}" in the ${selectedCategory || "selected"} category.` 
                : `No photos found in the ${selectedCategory || "selected"} category.`}
            </p>
          </div>
        )}

        {/* Photo Detail Dialog */}
        <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            {selectedPhoto && (
              <>
                <div className="relative h-[60vh]">
                  <img 
                    src={selectedPhoto.imageUrl} 
                    alt={selectedPhoto.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <DialogTitle className="text-xl mb-2">{selectedPhoto.title}</DialogTitle>
                  {selectedPhoto.description && (
                    <DialogDescription>
                      {selectedPhoto.description}
                    </DialogDescription>
                  )}
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Category: {selectedPhoto.category}
                    </span>
                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
                    </DialogClose>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Load More Button (if needed) */}
        {photos && photos.length > 12 && (
          <div className="text-center mt-10">
            <Button variant="secondary" className="bg-secondary hover:bg-secondary/90 text-white">
              Load More Photos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
