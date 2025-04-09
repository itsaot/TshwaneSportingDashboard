import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertPlayerSchema, Player } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Loader2, Upload, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Extend the insertPlayerSchema with validations
const formSchema = insertPlayerSchema.extend({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  surname: z.string().min(2, "Last name must be at least 2 characters"),
  idNumber: z.string().min(4, "ID number is required"),
  dateOfBirth: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
  age: z.number().min(5, "Age must be at least 5").max(60, "Age must be less than 60"),
  nationality: z.string().min(2, "Nationality is required"),
  preferredFoot: z.string().min(1, "Preferred foot is required"),
  position: z.string().min(1, "Position is required"),
  teamCategory: z.string().min(1, "Team category is required"),
  dateJoined: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
  registrationStatus: z.string().min(1, "Registration status is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface PlayerFormProps {
  player?: Player;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PlayerForm({ player, onSuccess, onCancel }: PlayerFormProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(player?.photoUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Calculate age from date of birth
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Default values for the form
  const defaultValues: Partial<FormValues> = player ? {
    ...player,
    dateOfBirth: new Date(player.dateOfBirth).toISOString().split('T')[0],
    dateJoined: new Date(player.dateJoined).toISOString().split('T')[0],
    safaId: player.safaId || "",
    race: player.race || "Not specified",
    nationality: player.nationality || "South African",
    preferredFoot: player.preferredFoot || "Right",
    position: player.position || "Midfielder",
    teamCategory: player.teamCategory || "Senior Team",
    registrationStatus: player.registrationStatus || "Pending",
    notes: player.notes || "",
  } : {
    firstName: "",
    surname: "",
    idNumber: "",
    dateOfBirth: "",
    age: 0,
    race: "Not specified",
    nationality: "South African",
    safaId: "",
    preferredFoot: "Right",
    position: "Midfielder",
    teamCategory: "Senior Team",
    dateJoined: new Date().toISOString().split('T')[0],
    registrationStatus: "Pending",
    photoUrl: "",
    notes: "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Form values being submitted:", values);
      const formData = new FormData();
      
      // Append all fields to formData
      // Convert ISO date strings to PostgreSQL date format (YYYY-MM-DD)
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Handle date fields specifically
          if (key === "dateOfBirth" || key === "dateJoined") {
            // Ensure date values are in YYYY-MM-DD format for PostgreSQL
            const dateValue = new Date(value.toString()).toISOString().split('T')[0];
            formData.append(key, dateValue);
          } else if (key === "age") {
            // Ensure age is sent as a number
            const ageValue = parseInt(value.toString(), 10);
            formData.append(key, ageValue.toString());
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      // Add photo if available
      if (photoFile) {
        formData.append("photo", photoFile);
      }
      
      // Determine if we're creating or updating
      if (player) {
        // Update existing player
        const response = await fetch(`/api/players/${player.id}`, {
          method: "PUT",
          body: formData,
          // No Content-Type header as it's automatically set for FormData
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error("Update player error response:", errorData);
          throw new Error(`Error updating player: ${response.statusText}`);
        }
      } else {
        // Create new player
        const response = await fetch("/api/players", {
          method: "POST",
          body: formData,
          // No Content-Type header as it's automatically set for FormData
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error("Create player error response:", errorData);
          throw new Error(`Error creating player: ${response.statusText}`);
        }
      }
      
      onSuccess();
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save player",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update age when date of birth changes
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dob = e.target.value;
    if (dob) {
      const age = calculateAge(dob);
      form.setValue("age", age);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-4">Personal Information</h3>
          </div>
          
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="First name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surname *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Surname" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Number *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ID number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth *</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        handleDobChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      value={field.value || 0}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      disabled 
                      className="bg-gray-100" 
                    />
                  </FormControl>
                  <FormDescription>
                    Calculated automatically from date of birth
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="race"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Race</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value || "Not specified"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select race" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Not specified">Not specified</SelectItem>
                      <SelectItem value="Black">Black</SelectItem>
                      <SelectItem value="White">White</SelectItem>
                      <SelectItem value="Indian">Indian</SelectItem>
                      <SelectItem value="Coloured">Coloured</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value || "South African"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select nationality" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="South African">South African</SelectItem>
                      <SelectItem value="Zimbabwean">Zimbabwean</SelectItem>
                      <SelectItem value="Mozambican">Mozambican</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel>Player Photo</FormLabel>
              <div className="flex items-center space-x-4 mt-2">
                <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Player" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <label className="cursor-pointer">
                  <div className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium transition flex items-center">
                    <Upload className="h-4 w-4 mr-2" />
                    {photoPreview ? "Change Photo" : "Upload Photo"}
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
          </div>
          
          {/* Football Information */}
          <div className="md:col-span-2 mt-6">
            <h3 className="text-lg font-medium mb-4">Football Information</h3>
          </div>
          
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="teamCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Category *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value || "Senior Team"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Senior Team">Senior Team (18+)</SelectItem>
                      <SelectItem value="U-17 Team">U-17 Team</SelectItem>
                      <SelectItem value="U-15 Team">U-15 Team</SelectItem>
                      <SelectItem value="U-13 Team">U-13 Team</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value || "Midfielder"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                      <SelectItem value="Defender">Defender</SelectItem>
                      <SelectItem value="Midfielder">Midfielder</SelectItem>
                      <SelectItem value="Forward">Forward</SelectItem>
                      <SelectItem value="Striker">Striker</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="preferredFoot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Foot *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value || "Right"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select foot" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Right">Right</SelectItem>
                      <SelectItem value="Left">Left</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="safaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SAFA ID</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="SAFA ID (if available)" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dateJoined"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Joined *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="registrationStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Status *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value || "Pending"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Registered">Registered</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Not Registered">Not Registered</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Additional Information */}
          <div className="md:col-span-2 mt-6">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      value={field.value || ""}
                      placeholder="Additional notes about the player" 
                      className="h-24"
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
                {player ? "Updating..." : "Saving..."}
              </>
            ) : (
              player ? "Update Player" : "Save Player"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
