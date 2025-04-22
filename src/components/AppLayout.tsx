
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const isStudent = user?.role === 'student';
  
  const navItems = isStudent
    ? [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'My NOC Requests', href: '/noc-requests' },
        { label: 'New Request', href: '/new-request' },
      ]
    : [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Pending Requests', href: '/pending-requests' },
        { label: 'All Requests', href: '/all-requests' },
      ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItems = () => (
    <>
      {navItems.map((item) => (
        <li key={item.href}>
          <Link
            to={item.href}
            className={cn(
              'block py-2 px-3 text-sm font-medium rounded-md hover:bg-nocify-primary/10 hover:text-nocify-primary transition-colors',
              location.pathname === item.href
                ? 'bg-nocify-primary/10 text-nocify-primary'
                : 'text-gray-700'
            )}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-nocify-primary">NOCify</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              <NavItems />
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <div className="text-sm">
                <span className="text-muted-foreground">Hello, </span>
                <span className="font-medium">{user?.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Mobile Navigation Trigger */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-nocify-primary">NOCify</span>
                      <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="text-sm mb-2">
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-muted-foreground">
                        {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto py-2">
                    <ul className="px-2 space-y-1">
                      <NavItems />
                    </ul>
                  </div>
                  <div className="p-4 border-t">
                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-nocify-background">
        <div className="container py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-4">
        <div className="container">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} NOCify - Internship NOC Management System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
