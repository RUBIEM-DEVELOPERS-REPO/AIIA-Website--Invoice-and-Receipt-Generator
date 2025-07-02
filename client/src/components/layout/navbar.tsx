import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import LoginDialog from "@/components/auth/login-dialog";
import logoImage from "@/lib/logos/preloader.png";
import { Badge } from "@/components/ui/badge";

const NAV_ITEMS = [
  { label: "AI Training", href: "/programs" },
  { label: "Collaborations", href: "/solution" },
  { label: "Publications", href: "/local_articles" },
  {
    label: "Membership",
    href: "/membership",
    className:
      "relative before:absolute before:inset-0 before:animate-rainbow before:bg-gradient-to-r before:from-purple-600 before:via-pink-600 before:to-blue-600 before:bg-[length:200%_100%] before:blur-sm before:-z-10 before:opacity-75 hover:before:opacity-100 before:transition-all px-2 py-1 rounded-md text-white",
  },
  { label: "Events", href: "/events" },
  { label: "Chat", href: "/chat" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [user, setUser] = useState<{
    email: string;
    plan: string;
    level: string;
    loginTime: string;
  } | null>(null);

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // Clear session storage
      sessionStorage.removeItem("user");
      setUser(null);

      // Reload the page to update state
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear local storage in case API call fails
      sessionStorage.removeItem("user");
      setUser(null);
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-right justify-between">
        <Link
          href="//"
          className="flex items-center gap-2 font-bold text-2xl text-primary"
        >
          <img src={logoImage} alt="AiiA Logo" className="h-8" />
          <span>AI Institute Africa</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === item.href ? "text-primary" : "text-foreground"
              } ${item.className || ""}`}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex items-center gap-2">
            {user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Email: {user.email}</p>
                    <p className="text-sm">Plan: {user.plan}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm">Status:</p>
                      {user.level === "admin" ? (
                        <Link href="/admin/dashboard">
                          <Badge variant="default">{user.level}</Badge>
                        </Link>
                      ) : (
                        <Badge variant="secondary">Member</Badge>
                      )}
                    </div>
                    {user.memberKey && (
                      <p className="text-sm">Member Key: {user.memberKey}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Logged in: {new Date(user.loginTime).toLocaleString()}
                    </p>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLoginDialog(true)}
                aria-label="Login"
              >
                <User className="h-5 w-5" />
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === item.href ? "text-primary" : "text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {user ? (
                <div className="space-y-2 border-t pt-4">
                  <p className="text-sm font-medium">Email: {user.email}</p>
                  <p className="text-sm">Plan: {user.plan}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm">Level:</p>
                    <Badge
                      variant={user.level === "admin" ? "default" : "secondary"}
                    >
                      {user.level}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    setIsOpen(false);
                    setShowLoginDialog(true);
                  }}
                >
                  <User className="h-5 w-5 mr-2" />
                  Login
                </Button>
              )}
              <ThemeToggle />
            </nav>
          </SheetContent>
        </Sheet>

        {/* Login Dialog */}
        <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
      </nav>
    </header>
  );
}
