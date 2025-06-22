import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { UserCheck, UserMinus, Shield, ShieldOff, Search, Trash2, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge, badgeVariants } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

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

export default function MembersPage() {
  const { toast } = useToast();
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: members = [], isLoading } = useQuery<Member[]>({
    queryKey: ["/api/admin/members"],
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({
      memberIds,
      action,
    }: {
      memberIds: number[];
      action: "activate" | "deactivate" | "delete" | "promote" | "demote";
    }) => {
      const res = await apiRequest(
        "POST",
        "/api/admin/members/bulk",
        { memberIds, action }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/members"] });
      setSelectedMembers([]);
      toast({
        title: "Success",
        description: "Selected members have been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(members.map((member) => member.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleSelectMember = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedMembers([...selectedMembers, id]);
    } else {
      setSelectedMembers(selectedMembers.filter((memberId) => memberId !== id));
    }
  };

  const handleBulkAction = (action: "activate" | "deactivate" | "delete" | "promote" | "demote") => {
    if (selectedMembers.length === 0) return;
    bulkUpdateMutation.mutate({ memberIds: selectedMembers, action });
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.country?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold tracking-tight">Member Management</h2>
          <Link href="/admin/dashboard">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[300px]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("activate")}
              disabled={selectedMembers.length === 0}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Activate Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("deactivate")}
              disabled={selectedMembers.length === 0}
            >
              <UserMinus className="w-4 h-4 mr-2" />
              Deactivate Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("promote")}
              disabled={selectedMembers.length === 0}
            >
              <Shield className="w-4 h-4 mr-2" />
              Promote to Admin
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("demote")}
              disabled={selectedMembers.length === 0}
            >
              <ShieldOff className="w-4 h-4 mr-2" />
              Demote to User
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleBulkAction("delete")}
              disabled={selectedMembers.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    filteredMembers.length > 0 &&
                    selectedMembers.length === filteredMembers.length
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Membership Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">Loading members...</TableCell>
              </TableRow>
            ) : filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">No members found</TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={(checked) =>
                        handleSelectMember(member.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.membershipType}</TableCell>
                  <TableCell>
                    <Badge variant={member.membershipStatus === "Active" ? "success" : member.membershipStatus === "Pending" ? "warning" : "destructive"}>
                      {member.membershipStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {member.level === "admin" ? (
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-1 text-primary" />
                        <span>Admin</span>
                      </div>
                    ) : (
                      <span>User</span>
                    )}
                  </TableCell>
                  <TableCell>{member.organization || "-"}</TableCell>
                  <TableCell>{member.country || "-"}</TableCell>
                  <TableCell>{new Date(member.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}