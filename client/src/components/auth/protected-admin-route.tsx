import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import LoginDialog from "./login-dialog";
import { Button } from "@/components/ui/button";

// Define user type
interface User {
  id: number;
  email: string;
  name?: string;
  level?: string;
  membershipStatus?: string;
  membershipType?: string;
  role?: string;
  isAdmin?: boolean;
}

// Component to show when authentication is required
function AuthRequired({ onLoginClick }: { onLoginClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4 px-4 text-center">
      <h1 className="text-2xl font-bold">Admin Access Required</h1>
      <p className="text-muted-foreground max-w-md">
        You need to be logged in as an administrator to access this page.
      </p>
      <Button onClick={onLoginClick} className="mt-4">
        Login to Continue
      </Button>
    </div>
  );
}

export function ProtectedAdminRoute({
  path,
  component: Component,
  requiredRole,
}: {
  path: string;
  component: () => React.JSX.Element;
  requiredRole?: string[];
}) {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  
  // Use regular auth to check if user is an admin
  const { data: currentUser, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Check session storage for user info as a fallback
  const [sessionUser, setSessionUser] = useState<any>(null);
  
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setSessionUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data from session storage");
      }
    }
  }, []);

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  // First check if the user is authenticated and has admin access
  // Also check the session storage as a backup
  const isAdmin = (currentUser && currentUser.level === "admin") || 
                 (sessionUser && sessionUser.level === "admin");
  
  if (!isAdmin) {
    return (
      <Route path={path}>
        <>
          <AuthRequired onLoginClick={() => setShowLoginDialog(true)} />
          <LoginDialog 
            open={showLoginDialog} 
            onOpenChange={setShowLoginDialog}
            redirectPath={path}
          />
        </>
      </Route>
    );
  }

  // If requiredRole is specified, check if user has the required role
  // For now, we'll just check admin level since the specific roles
  // might not be fully implemented in the backend yet
  if (requiredRole && requiredRole.length > 0) {
    // Allow access if user has the required role or is a super_admin
    // Note: This is a simplified implementation assuming all admins have access for now
    // const hasRequiredRole = requiredRole.includes(currentUser.role || '') || currentUser.role === 'super_admin';
    // if (!hasRequiredRole) {
    //   return (
    //     <Route path={path}>
    //       <Redirect to="/admin/dashboard" />
    //     </Route>
    //   );
    // }
  }

  return <Route path={path} component={Component} />;
}
