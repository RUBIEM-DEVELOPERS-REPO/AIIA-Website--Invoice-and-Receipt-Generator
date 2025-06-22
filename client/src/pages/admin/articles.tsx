import { useState } from "react";
import { format } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { ChevronLeft, Edit, Plus, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useToast } from "@/hooks/use-toast";
type SelectLocalArticle = {
  id: number;
  title: string;
  author: string;
  content: string;
  imageUrl?: string;
  requirement: "Free" | "Membership";
  createdAt: Date | string;
  updatedAt?: Date | string;
};

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

// Type definition for our article
type Article = {
  id: number;
  title: string;
  author: string;
  content: string;
  imageUrl?: string;
  requirement: "Free" | "Membership";
  createdAt: Date | string;
  updatedAt?: Date | string;
  source: 'local';
};

// Form schema
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  author: z.string().min(3, "Author must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  imageUrl: z.string().url().optional().or(z.literal('')),
  requirement: z.enum(["Free", "Membership"]).default("Free"),
});

type FormData = z.infer<typeof formSchema>;

export default function ArticlesPage() {
  const { admin } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  
  // Query for fetching local articles only
  const { data: localArticles, isLoading } = useQuery({
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

  // Format local articles for display
  const articles = localArticles ? localArticles.map((article: SelectLocalArticle) => ({
    ...article,
    source: 'local' as const
  })) : [];

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
      
      const endpoint = `/api/admin/local-articles/${currentArticle.id}`;
      const response = await apiRequest("PUT", endpoint, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/local-articles"] });
      
      toast({
        title: "Article Updated",
        description: "The article has been updated successfully.",
      });
      setIsDialogOpen(false);
      setCurrentArticle(null);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update article: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Create article mutation
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const endpoint = "/api/admin/local-articles";
      const response = await apiRequest("POST", endpoint, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/local-articles"] });
      
      toast({
        title: "Article Created",
        description: "The article has been created successfully.",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create article: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete article mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const endpoint = `/api/admin/local-articles/${id}`;
      const response = await apiRequest("DELETE", endpoint);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/local-articles"] });
      
      toast({
        title: "Article Deleted",
        description: "The article has been deleted successfully.",
      });
      setIsDeleteDialogOpen(false);
      setCurrentArticle(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete article: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onOpenCreateDialog = () => {
    setCurrentArticle(null);
    form.reset({
      title: "",
      author: "",
      content: "",
      imageUrl: "",
      requirement: "Free",
    });
    setIsDialogOpen(true);
  };

  const onOpenEditDialog = (article: Article) => {
    setCurrentArticle(article);
    form.reset({
      title: article.title,
      author: article.author,
      content: article.content,
      imageUrl: article.imageUrl || "",
      requirement: article.requirement as "Free" | "Membership",
    });
    setIsDialogOpen(true);
  };

  const onOpenDeleteDialog = (article: Article) => {
    setCurrentArticle(article);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = (data: FormData) => {
    if (currentArticle) {
      // When editing an existing article
      editMutation.mutate(data);
    } else {
      // When creating a new article
      createMutation.mutate(data);
    }
  };

  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Button variant="outline" asChild className="mr-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <ChevronLeft size={16} /> Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Articles Management</h1>
      </div>
      
      <div className="flex justify-end mb-6">
        <Button onClick={onOpenCreateDialog} className="gap-2">
          <Plus size={16} /> Add New Article
        </Button>
      </div>

      <Separator className="my-6" />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading articles...</div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
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
                articles.map((article: Article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>{article.author}</TableCell>
                    <TableCell>
                      <Badge variant={article.requirement === "Free" ? "default" : "secondary"}>
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
                    No articles found. Click "Add New Article" to create one.
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
              {currentArticle ? "Edit Article" : "Create New Article"}
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

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                  disabled={
                    createMutation.isPending || editMutation.isPending
                  }
                >
                  {createMutation.isPending || editMutation.isPending ? (
                    "Saving..."
                  ) : currentArticle ? (
                    "Update Article"
                  ) : (
                    "Create Article"
                  )}
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
              Are you sure you want to delete the article "
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
              onClick={() => currentArticle && deleteMutation.mutate(currentArticle.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Article"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}