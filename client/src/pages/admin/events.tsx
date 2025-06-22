import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { SelectEvent, eventCreationSchema } from "@db/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Edit,
  Plus,
  Trash2,
  ChevronLeft,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { format, parseISO } from "date-fns";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { ProtectedAdminRoute } from "@/components/auth/protected-admin-route";
import { Link } from "wouter";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Create form schema based on the event schema
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  type: z.enum(["Conference", "Workshop", "Webinar", "Meetup", "Other"]),
  capacity: z
    .union([z.number(), z.string()])
    .optional()
    .transform((val) => {
      if (typeof val === "string" && val !== "") {
        return parseInt(val);
      }
      if (typeof val === "number") {
        return val;
      }
      return undefined;
    }),
  registrationRequired: z.boolean().default(false),
  registrationUrl: z.string().url().optional().or(z.literal("")),
  // Accept both URLs and local file paths for images
  imageUrl: z.string().optional().or(z.literal("")),
  organizer: z.string().min(1, "Organizer is required"),
  status: z
    .enum(["Upcoming", "Ongoing", "Completed", "Cancelled"])
    .default("Upcoming"),
});

type FormData = z.infer<typeof formSchema>;

export default function EventsPage() {
  const { admin } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<SelectEvent | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Query for fetching events
  const { data: events, isLoading } = useQuery({
    queryKey: ["/api/admin/events"],
    queryFn: async () => {
      const response = await fetch("/api/admin/events");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      return response.json();
    },
    enabled: !!admin,
  });

  // Form setup
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      location: "",
      type: "Conference",
      capacity: undefined,
      registrationRequired: false,
      registrationUrl: "",
      imageUrl: "",
      organizer: "",
      status: "Upcoming",
    },
  });

  // Edit event mutation
  const editMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!currentEvent) return null;
      const response = await apiRequest(
        "PUT",
        `/api/admin/events/${currentEvent.id}`,
        data,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      toast({
        title: "Event Updated",
        description: "The event has been updated successfully.",
      });
      setIsDialogOpen(false);
      setCurrentEvent(null);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update event: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Create event mutation
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/admin/events", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      toast({
        title: "Event Created",
        description: "The event has been created successfully.",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create event: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/admin/event-image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload image");
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.success && data.imagePath) {
        form.setValue("imageUrl", data.imagePath);
        setIsUploading(false);
        toast({
          title: "Image Uploaded",
          description: "Event image was uploaded successfully.",
        });
      }
    },
    onError: (error) => {
      setIsUploading(false);
      toast({
        title: "Upload Failed",
        description: `Failed to upload image: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete event mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/events/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      toast({
        title: "Event Deleted",
        description: "The event has been deleted successfully.",
      });
      setIsDeleteDialogOpen(false);
      setCurrentEvent(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete event: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onOpenCreateDialog = () => {
    setCurrentEvent(null);
    form.reset({
      title: "",
      description: "",
      date: "",
      location: "",
      type: "Conference",
      capacity: undefined,
      registrationRequired: false,
      registrationUrl: "",
      imageUrl: "",
      organizer: "",
      status: "Upcoming",
    });
    setIsDialogOpen(true);
  };

  const onOpenEditDialog = (event: SelectEvent) => {
    setCurrentEvent(event);
    form.reset({
      title: event.title,
      description: event.description,
      date: format(new Date(event.date), "yyyy-MM-dd'T'HH:mm"),
      location: event.location,
      type: event.type as
        | "Conference"
        | "Workshop"
        | "Webinar"
        | "Meetup"
        | "Other",
      capacity: typeof event.capacity === "number" ? event.capacity : undefined,
      registrationRequired: event.registrationRequired || false,
      registrationUrl: event.registrationUrl || "",
      imageUrl: event.imageUrl || "",
      organizer: event.organizer,
      status: event.status as
        | "Upcoming"
        | "Ongoing"
        | "Completed"
        | "Cancelled",
    });
    setIsDialogOpen(true);
  };

  const onOpenDeleteDialog = (event: SelectEvent) => {
    setCurrentEvent(event);
    setIsDeleteDialogOpen(true);
  };

  // Image file handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImageFile(file);

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload the file
      uploadImageMutation.mutate(file);
    }
  };

  // Reset image state when dialog is closed
  useEffect(() => {
    if (!isDialogOpen) {
      setImageFile(null);
      setImagePreview(null);
    } else if (currentEvent?.imageUrl) {
      // Set preview for editing existing event with image
      setImagePreview(currentEvent.imageUrl);
    }
  }, [isDialogOpen, currentEvent]);

  const onSubmit = (data: FormData) => {
    if (currentEvent) {
      editMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const getStatusBadgeVariant = (
    status: string,
  ):
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning" => {
    switch (status) {
      case "Upcoming":
        return "success";
      case "Ongoing":
        return "warning";
      case "Completed":
        return "secondary";
      case "Cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">Events Management</h1>
      </div>

      <div className="flex justify-end mb-6">
        <Button variant="outline" asChild className="mr-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <ChevronLeft size={16} /> Back to Dashboard
          </Link>
        </Button>

        <Button onClick={onOpenCreateDialog} className="gap-2">
          <Plus size={16} /> Add New Event
        </Button>
      </div>

      <Separator className="my-6" />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading events...</div>
        </div>
      ) : (
        <div className="rounded-md border flex items-center justify-center ml-24">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events && events.length > 0 ? (
                events.map((event: SelectEvent) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>
                      {format(new Date(event.date), "MMM d, yyyy h:mm a")}
                    </TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>{event.type}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(event.status)}>
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onOpenEditDialog(event)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onOpenDeleteDialog(event)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No events found. Click "Add New Event" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentEvent ? "Edit Event" : "Create New Event"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Event title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date and Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Event location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Conference">Conference</SelectItem>
                          <SelectItem value="Workshop">Workshop</SelectItem>
                          <SelectItem value="Webinar">Webinar</SelectItem>
                          <SelectItem value="Meetup">Meetup</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organizer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organizer</FormLabel>
                      <FormControl>
                        <Input placeholder="Event organizer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Upcoming">Upcoming</SelectItem>
                          <SelectItem value="Ongoing">Ongoing</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity (optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Maximum attendees"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Image</FormLabel>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Input type="hidden" {...field} />
                          <Button
                            type="button"
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                          >
                            {isUploading ? "Uploading..." : "Upload Image"}
                            <Upload size={16} />
                          </Button>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                          />
                        </div>

                        {imagePreview ? (
                          <div className="border rounded-md overflow-hidden w-full max-w-sm">
                            <AspectRatio ratio={16 / 9}>
                              <img
                                src={imagePreview}
                                alt="Event image preview"
                                className="w-full h-full object-cover"
                              />
                            </AspectRatio>
                          </div>
                        ) : (
                          <div className="border rounded-md flex items-center justify-center w-full max-w-sm bg-muted/20">
                            <AspectRatio ratio={16 / 9}>
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <ImageIcon size={48} strokeWidth={1} />
                                <p className="text-sm mt-2">
                                  No image selected
                                </p>
                              </div>
                            </AspectRatio>
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-1 md:col-span-2">
                  <FormField
                    control={form.control}
                    name="registrationRequired"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Registration Required</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch("registrationRequired") && (
                  <div className="col-span-1 md:col-span-2">
                    <FormField
                      control={form.control}
                      name="registrationUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/register"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div className="col-span-1 md:col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Event description"
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || editMutation.isPending}
                >
                  {createMutation.isPending || editMutation.isPending
                    ? "Saving..."
                    : currentEvent
                      ? "Update Event"
                      : "Create Event"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete the event "
              <strong>{currentEvent?.title}</strong>"? This action cannot be
              undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() =>
                currentEvent && deleteMutation.mutate(currentEvent.id)
              }
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
