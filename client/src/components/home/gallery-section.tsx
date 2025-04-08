import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Photo } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const { user } = useAuth();

  const { data: photos, isLoading } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
    enabled: !!user, // Only fetch if user is logged in
  });

  // Take only 8 photos for the homepage
  const filteredPhotos = photos
    ?.filter(photo => selectedCategory ? photo.category === selectedCategory : true)
    ?.slice(0, 8);

  return (
    <section className="py-16 bg-white" id="gallery">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-heading font-bold mb-3">Photo Gallery</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Capturing the defining moments of our club both on and off the pitch.
          </p>
        </motion.div>

        {/* Gallery Filter */}
        <motion.div 
          className="flex flex-wrap justify-center mb-10 gap-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList>
              <TabsTrigger value="">All Photos</TabsTrigger>
              <TabsTrigger value="Match Days">Match Days</TabsTrigger>
              <TabsTrigger value="Training">Training</TabsTrigger>
              <TabsTrigger value="Team Events">Team Events</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Gallery Grid */}
        {!user ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium mb-2">Members-Only Gallery</h3>
            <p className="text-gray-500 mb-6">
              Please login or register to view our full photo gallery.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/auth">
                <Button variant="default">Login</Button>
              </Link>
              <Link href="/auth?tab=register">
                <Button variant="outline">Register</Button>
              </Link>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredPhotos && filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                className="relative overflow-hidden rounded-lg bg-gray-200 cursor-pointer"
                style={{ aspectRatio: "1/1" }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                  <span className="text-white font-medium">{photo.title}</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No photos available in this category at the moment.</p>
          </div>
        )}

        <motion.div 
          className="text-center mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/gallery">
            <Button className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3">
              View More Photos
            </Button>
          </Link>
        </motion.div>

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
                  <h2 className="text-xl font-bold mb-2">{selectedPhoto.title}</h2>
                  {selectedPhoto.description && (
                    <p className="text-gray-600 mb-2">{selectedPhoto.description}</p>
                  )}
                  <p className="text-sm text-gray-500">Category: {selectedPhoto.category}</p>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
