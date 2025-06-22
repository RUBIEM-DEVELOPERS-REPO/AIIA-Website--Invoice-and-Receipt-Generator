import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { SelectLocalArticle } from "@db/schema";
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
  FormDescription,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Edit,
  Plus,
  Trash2,
  ChevronLeft,
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Form schema
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  author: z.string().min(3, "Author must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  // Accept both URLs and relative paths for images
  imageUrl: z.string().optional().or(z.literal("")),
  requirement: z.enum(["Free", "Membership"]).default("Free"),
});

type FormData = z.infer<typeof formSchema>;

export default function LocalArticlesPage() {
  const { admin } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentArticle, setCurrentArticle] =
    useState<SelectLocalArticle | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Query for fetching local articles
  const { data: articles, isLoading } = useQuery({
    queryKey: ["/api/admin/local-articles"],
    queryFn: async () => {
      const response = await fetch("/api/admin/local-articles");
      if (!response.ok) {
        throw new Error("Failed to fetch local articles");
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
      author: "",
      content: "",
      imageUrl: "",
      requirement: "Free",
    },
  });

  // Edit article mutation
  const editMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!currentArticle) return null;
      const response = await apiRequest(
        "PUT",
        `/api/admin/local-articles/${currentArticle.id}`,
        data,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/local-articles"],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/local-articles"] });
      toast({
        title: "Local Article Updated",
        description: "The local article has been updated successfully.",
      });
      setIsDialogOpen(false);
      setCurrentArticle(null);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update local article: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Create article mutation
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest(
        "POST",
        "/api/admin/local-articles",
        data,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/local-articles"],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/local-articles"] });
      toast({
        title: "Local Article Created",
        description: "The local article has been created successfully.",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create local article: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete article mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(
        "DELETE",
        `/api/admin/local-articles/${id}`,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/local-articles"],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/local-articles"] });
      toast({
        title: "Local Article Deleted",
        description: "The local article has been deleted successfully.",
      });
      setIsDeleteDialogOpen(false);
      setCurrentArticle(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete local article: ${error.message}`,
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

      const response = await fetch("/api/admin/article-image-upload", {
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
        toast({
          title: "Image Uploaded",
          description: "The image has been uploaded successfully.",
        });
      }
      setIsUploading(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to upload image: ${error.message}`,
        variant: "destructive",
      });
      setIsUploading(false);
    },
  });

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

  const clearImagePreview = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onOpenCreateDialog = () => {
    setCurrentArticle(null);
    form.reset({
      title: "",
      author: "",
      content: "",
      imageUrl: "",
      requirement: "Free",
    });
    setImagePreview(null);
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const onOpenEditDialog = (article: SelectLocalArticle) => {
    setCurrentArticle(article);
    form.reset({
      title: article.title,
      author: article.author,
      content: article.content,
      imageUrl: article.imageUrl || "",
      requirement: article.requirement as "Free" | "Membership",
    });

    // Set image preview if there's an existing image URL
    // For existing images, use the absolute path for preview
    if (article.imageUrl) {
      setImagePreview(
        article.imageUrl.startsWith("http")
          ? article.imageUrl
          : article.imageUrl,
      );
    } else {
      setImagePreview(null);
    }

    setImageFile(null);
    setIsDialogOpen(true);
  };

  const onOpenDeleteDialog = (article: SelectLocalArticle) => {
    setCurrentArticle(article);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = (data: FormData) => {
    if (currentArticle) {
      editMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="container py-10  mx-auto">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-3xl font-bold mb-4">Local Articles Management</h1>

        <div className="flex gap-4 w-full justify-center">
          <Button variant="outline" asChild>
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <ChevronLeft size={16} /> Back to Dashboard
            </Link>
          </Button>

          <Button onClick={onOpenCreateDialog} className="gap-2">
            <Plus size={16} /> Add New Local Article
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading local articles...</div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table style={{ width: "100%" }}>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Requirement</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles && articles.length > 0 ? (
                articles.map((article: SelectLocalArticle) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">
                      {article.title}
                    </TableCell>
                    <TableCell>{article.author}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          article.requirement === "Free"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {article.requirement}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(article.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onOpenEditDialog(article)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onOpenDeleteDialog(article)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No local articles found. Click "Add New Local Article" to
                    create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Article Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentArticle
                ? "Edit Local Article"
                : "Create New Local Article"}
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
                        <Input placeholder="Article title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input placeholder="Author name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requirement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Requirement</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select requirement" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Free">Free</SelectItem>
                          <SelectItem value="Membership">Membership</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="URL will be auto-populated when image is uploaded"
                            {...field}
                            readOnly
                          />
                        </FormControl>
                        <FormDescription>
                          Use the image uploader below to add an image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        className="gap-2"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        <Upload size={16} />
                        {isUploading ? "Uploading..." : "Upload Image"}
                      </Button>
                      {imagePreview && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={clearImagePreview}
                          className="text-destructive"
                        >
                          <X size={16} />
                        </Button>
                      )}
                    </div>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />

                    {imagePreview && (
                      <div className="border rounded-md overflow-hidden w-full max-w-xs">
                        <AspectRatio ratio={16 / 9}>
                          <img
                            src={imagePreview}
                            alt="Article image preview"
                            className="w-full h-full object-cover"
                          />
                        </AspectRatio>
                      </div>
                    )}

                    {!imagePreview && (
                      <div className="border border-dashed rounded-md p-8 text-center bg-muted/30 w-full max-w-xs">
                        <div className="flex flex-col items-center gap-2">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            No image uploaded
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Article content"
                            className="min-h-[300px]"
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
                    : currentArticle
                      ? "Update Local Article"
                      : "Create Local Article"}
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
              Are you sure you want to delete the local article "
              <strong>{currentArticle?.title}</strong>"? This action cannot be
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
                currentArticle && deleteMutation.mutate(currentArticle.id)
              }
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending
                ? "Deleting..."
                : "Delete Local Article"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
