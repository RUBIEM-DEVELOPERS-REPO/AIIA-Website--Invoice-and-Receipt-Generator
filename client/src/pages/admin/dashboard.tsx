import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  UserPlus,
  UserMinus,
  Trash2,
  Settings,
  Bell,
  Shield,
  ShieldOff,
  Calendar,
  FileText,
  BellRing,
  CircleCheck,
  Mail,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Member = {
  id: number;
  name: string;
  email: string;
  membershipType: string;
  membershipStatus: string;
  level: string;
  organization?: string;
  country?: string;
  createdAt: string;
};

type DashboardStats = {
  totalMembers: number;
  activeMembers: number;
  pendingMembers: number;
  recentApplications: number;
  recentMembers: Member[]; // Add recentMembers to the type
};

export default function AdminDashboard() {
  const { toast } = useToast();
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/dashboard/stats"],
  });

  const bulkActionMutation = useMutation({
    mutationFn: async (
      action: "activate" | "deactivate" | "delete" | "promote" | "demote",
    ) => {
      const memberIds = stats?.recentMembers.map((member) => member.id) || [];
      const res = await apiRequest("POST", "/api/admin/members/bulk", {
        memberIds,
        action,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/dashboard/stats"],
      });
      toast({
        title: "Success",
        description: "Bulk operation completed successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to perform bulk operation",
        variant: "destructive",
      });
    },
  });

  const handleBulkAction = (
    action: "activate" | "deactivate" | "delete" | "promote" | "demote",
  ) => {
    const confirmMessages = {
      activate: "Are you sure you want to activate all members?",
      deactivate: "Are you sure you want to deactivate all members?",
      delete:
        "Are you sure you want to delete all members? This action cannot be undone.",
      promote: "Are you sure you want to promote all members to admin level?",
      demote: "Are you sure you want to demote all members to user level?",
    };

    if (window.confirm(confirmMessages[action])) {
      bulkActionMutation.mutate(action);
    }
  };

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold tracking-tight mb-6">
        Admin Dashboard
      </h2>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalMembers || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Members
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.activeMembers || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Members
            </CardTitle>
            <UserMinus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.pendingMembers || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Applications
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.recentApplications || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Actions */}
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">Member Management</TabsTrigger>
          <TabsTrigger value="content">Content Management</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Member Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/admin/members">
                    <Users className="mr-2 h-4 w-4" />
                    View All Members
                  </Link>
                </Button>
                <Button asChild className="w-full" variant="secondary">
                  <Link href="/admin/marketing-email">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Marketing Email
                  </Link>
                </Button>
                <Button variant="outline" className="w-full">
                  <Bell className="mr-2 h-4 w-4" />
                  Send Notifications
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats?.recentMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>{member.name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{member.membershipStatus}</TableCell>
                          <TableCell className="flex items-center">
                            {member.level === "admin" ? (
                              <Shield className="w-4 h-4 mr-1 text-primary" />
                            ) : null}
                            {member.level}
                          </TableCell>
                          <TableCell>
                            {new Date(member.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bulk Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => handleBulkAction("activate")}
                  disabled={bulkActionMutation.isPending}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Activate All Members
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => handleBulkAction("deactivate")}
                  disabled={bulkActionMutation.isPending}
                >
                  <UserMinus className="mr-2 h-4 w-4" />
                  Deactivate All Members
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => handleBulkAction("promote")}
                  disabled={bulkActionMutation.isPending}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Promote All to Admin
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => handleBulkAction("demote")}
                  disabled={bulkActionMutation.isPending}
                >
                  <ShieldOff className="mr-2 h-4 w-4" />
                  Demote All to User
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleBulkAction("delete")}
                  disabled={bulkActionMutation.isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete All Members
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Content Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/admin/events">
                    <Calendar className="mr-2 h-4 w-4" />
                    Manage Events
                  </Link>
                </Button>
                <div className="flex flex-col space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/admin/articles">
                      <FileText className="mr-2 h-4 w-4" />
                      Manage Articles
                    </Link>
                  </Button>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/admin/local-articles">
                      <FileText className="mr-2 h-4 w-4" />
                      Manage Local Articles
                    </Link>
                  </Button>
                </div>
                <Button variant="outline" className="w-full">
                  <BellRing className="mr-2 h-4 w-4" />
                  Send Content Updates
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Content Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-lg border p-3">
                      <h3 className="font-medium flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-primary" />
                        Events Management
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Create, edit, and manage upcoming events for the AI
                        Institute. Set event details, registration options, and
                        track attendance.
                      </p>
                      <Button asChild size="sm" className="mt-4">
                        <Link href="/admin/events">Go to Events</Link>
                      </Button>
                    </div>

                    <div className="rounded-lg border p-3">
                      <h3 className="font-medium flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-primary" />
                        Articles Management
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Publish and manage articles, research papers, and news
                        content. Control access requirements for members and the
                        public.
                      </p>
                      <div className="flex gap-2 mt-4">
                        <Button asChild size="sm" variant="outline">
                          <Link href="/admin/local-articles">
                            Local Articles
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-3">
                    <h3 className="font-medium mb-2">Quick Tips</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li className="flex items-start">
                        <CircleCheck className="mr-2 h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        Use high-quality images for events and articles to
                        enhance visual appeal
                      </li>
                      <li className="flex items-start">
                        <CircleCheck className="mr-2 h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        Keep event details current, especially for
                        time-sensitive information
                      </li>
                      <li className="flex items-start">
                        <CircleCheck className="mr-2 h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        Mark premium content appropriately with the "Membership"
                        requirement setting
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Settings and configuration options coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
