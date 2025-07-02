import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./lib/theme-provider";
import { MembershipProvider } from "./lib/membership-context";
import { AdminAuthProvider } from "@/hooks/use-admin-auth";
import { ProtectedAdminRoute } from "@/components/auth/protected-admin-route";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import About from "@/pages/about";
import Programs from "@/pages/programs";
import Solution from "@/pages/solution";
import News from "@/pages/news";
import Contact from "@/pages/contact";
import Membership from "@/pages/membership";
import Payment from "@/pages/payment";
import Forms from "@/pages/forms";
import Events from "@/pages/events";
import Local_Articles from "@/pages/local_articles";
import Chat from "@/pages/chat";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import NotFound from "@/pages/not-found";
import AdminForgotPassword from "@/pages/admin/forgot-password";
import AdminResetPassword from "@/pages/admin/reset-password";
import AdminDashboard from "@/pages/admin/dashboard";
import MembersPage from "@/pages/admin/members";
import EventsPage from "@/pages/admin/events";
import ArticlesPage from "@/pages/admin/articles";
import LocalArticlesPage from "@/pages/admin/local-articles";
import { ChatAssistant } from "@/components/ui/chat-assistant";

function Router() {
  const [location] = useLocation();
  const isFullscreenRoute = location === "/chat";

  if (isFullscreenRoute) {
    return (
      <Switch>
        <Route path="/chat" component={Chat} />
      </Switch>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          {/* Public Routes */}
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/programs" component={Programs} />
          <Route path="/solution" component={Solution} />
          <Route path="/news" component={News} />
          <Route path="/membership" component={Membership} />
          <Route path="/contact" component={Contact} />
          <Route path="/payment" component={Payment} />
          <Route path="/application" component={Forms} />
          <Route path="/forms" component={Forms} />
          <Route path="/events" component={Events} />
          <Route path="/local_articles" component={Local_Articles} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/reset-password" component={ResetPassword} />

          {/* Admin Routes */}
          <Route path="/admin/forgot-password" component={AdminForgotPassword} />
          <Route path="/admin/reset-password" component={AdminResetPassword} />
          <ProtectedAdminRoute
            path="/admin/dashboard"
            component={AdminDashboard}
            requiredRole={["super_admin", "content_admin", "member_admin"]}
          />
          <ProtectedAdminRoute
            path="/admin/members"
            component={MembersPage}
            requiredRole={["super_admin", "content_admin", "member_admin"]}
          />
          <ProtectedAdminRoute
            path="/admin/events"
            component={EventsPage}
            requiredRole={["super_admin", "content_admin", "member_admin"]}
          />
          <ProtectedAdminRoute
            path="/admin/articles"
            component={ArticlesPage}
            requiredRole={["super_admin", "content_admin", "member_admin"]}
          />
          <ProtectedAdminRoute
            path="/admin/local-articles"
            component={LocalArticlesPage}
            requiredRole={["super_admin", "content_admin", "member_admin"]}
          />

          {/* 404 Route */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const [location] = useLocation();
  const isFullscreenRoute = location === "/chat";

  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <AdminAuthProvider>
          <MembershipProvider>
            <Router />
            <Toaster />
            {!isFullscreenRoute && <ChatAssistant />}
          </MembershipProvider>
        </AdminAuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;