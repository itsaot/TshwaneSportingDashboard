import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Photo } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Search, Plus, Edit, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import UploadPhotoForm from "@/components/admin/upload-photo-form";

export default function GalleryManagement() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);
  const { toast } = useToast();

  const { data: photos, isLoading, error } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/photos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({
        title: "Photo deleted",
        description: "The photo has been successfully deleted.",
        variant: "default",
      });
      setPhotoToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete photo: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const filteredPhotos = photos?.filter(photo => {
    const matchesCategory = selectedCategory === "All" ? true : photo.category === selectedCategory;
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
            <h1 className="text-2xl md:text-3xl font-heading font-bold">Gallery Management</h1>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsAddPhotoOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Upload New Photo
            </Button>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList>
                <TabsTrigger value="All">All Photos</TabsTrigger>
                <TabsTrigger value="Match Days">Match Days</TabsTrigger>
                <TabsTrigger value="Training">Training</TabsTrigger>
                <TabsTrigger value="Team Events">Team Events</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search gallery..."
              className="pl-10 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Gallery Grid */}
        <Card className="p-6">
          {filteredPhotos && filteredPhotos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPhotos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-square rounded-md overflow-hidden bg-gray-200">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <div className="text-white text-center p-2">
                      <p className="font-medium text-sm mb-1">{photo.title}</p>
                      <p className="text-xs">{photo.category}</p>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingPhoto(photo)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setPhotoToDelete(photo)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No Photos Found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? `No photos match "${searchQuery}" in the ${selectedCategory || "selected"} category.`
                  : `No photos found in the ${selectedCategory || "selected"} category.`}
              </p>
              {searchQuery || selectedCategory ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                >
                  Clear filters
                </Button>
              ) : (
                <Button onClick={() => setIsAddPhotoOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Your First Photo
                </Button>
              )}
            </div>
          )}
        </Card>

        {/* Add Photo Dialog */}
        <Dialog open={isAddPhotoOpen} onOpenChange={setIsAddPhotoOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload New Photo</DialogTitle>
              <DialogDescription>
                Add a new photo to the gallery. The photo will be visible to all registered users.
              </DialogDescription>
            </DialogHeader>
            <UploadPhotoForm
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
                toast({
                  title: "Success",
                  description: "Photo uploaded successfully",
                  variant: "default",
                });
                setIsAddPhotoOpen(false);
              }}
              onCancel={() => setIsAddPhotoOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Photo Dialog */}
        <Dialog
          open={!!editingPhoto}
          onOpenChange={(open) => !open && setEditingPhoto(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Photo</DialogTitle>
              <DialogDescription>
                Update photo information.
              </DialogDescription>
            </DialogHeader>
            {editingPhoto && (
              <UploadPhotoForm
                photo={editingPhoto}
                onSuccess={() => {
                  queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
                  toast({
                    title: "Success",
                    description: "Photo updated successfully",
                    variant: "default",
                  });
                  setEditingPhoto(null);
                }}
                onCancel={() => setEditingPhoto(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!photoToDelete}
          onOpenChange={(open) => !open && setPhotoToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the photo "{photoToDelete?.title}" from the gallery. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  if (photoToDelete) {
                    deleteMutation.mutate(photoToDelete.id);
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
                  "Delete Photo"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
