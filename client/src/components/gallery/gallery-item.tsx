import { Photo } from "@shared/schema";
import { motion } from "framer-motion";

interface GalleryItemProps {
  photo: Photo;
  onClick: () => void;
}

export default function GalleryItem({ photo, onClick }: GalleryItemProps) {
  return (
    <motion.div 
      className="relative overflow-hidden rounded-lg bg-gray-200 cursor-pointer"
      style={{ aspectRatio: "1/1" }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
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
  );
}
