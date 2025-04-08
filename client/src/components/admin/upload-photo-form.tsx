import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertPhotoSchema, Photo } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

// Extend the insertPhotoSchema with validations
const formSchema = insertPhotoSchema.extend({
  title: z.string().min(2, "Title must be at least 2 characters"),
  category: z.string().min(2, "Category is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface UploadPhotoFormProps {
  photo?: Photo;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UploadPhotoForm({ photo, onSuccess, onCancel }: UploadPhotoFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(photo?.imageUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Default values for the form
  const defaultValues: Partial<FormValues> = photo ? {
    ...photo,
  } : {
    title: "",
    category: "",
    description: "",
    imageUrl: "",
    uploadedBy: user?.id || 0,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: FormValues) => {
    // For new photos, an image file is required
    if (!photo && !imageFile) {
      toast({
        title: "Image required",
        description: "Please upload an image for the photo",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Append all fields to formData
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      
      // Add image if available
      if (imageFile) {
        formData.append("image", imageFile);
      }
      
      // Set uploaded by to current user
      if (user) {
        formData.append("uploadedBy", user.id.toString());
      }
      
      // Determine if we're creating or updating
      if (photo) {
        // Update existing photo
        const response = await fetch(`/api/photos/${photo.id}`, {
          method: "PUT",
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Error updating photo: ${response.statusText}`);
        }
      } else {
        // Create new photo
        const response = await fetch("/api/photos", {
          method: "POST",
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Error uploading photo: ${response.statusText}`);
        }
      }
      
      onSuccess();
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save photo",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormLabel className="block mb-4">Photo</FormLabel>
            <div className="border rounded-md overflow-hidden bg-gray-50" style={{ aspectRatio: "1/1" }}>
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="h-16 w-16 text-gray-300" />
                </div>
              )}
            </div>
            <div className="mt-4">
              <label className="cursor-pointer">
                <div className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium transition flex items-center justify-center w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  {imagePreview ? "Change Photo" : "Upload Photo"}
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
          
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Photo title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Match Days">Match Days</SelectItem>
                      <SelectItem value="Training">Training</SelectItem>
                      <SelectItem value="Team Events">Team Events</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Optional description for the photo" 
                      className="h-32"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {photo ? "Updating..." : "Uploading..."}
              </>
            ) : (
              photo ? "Update Photo" : "Upload Photo"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
