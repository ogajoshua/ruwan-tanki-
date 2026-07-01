import { Link, useNavigate } from 'react-router-dom';
import { User } from '../../lib/mock-db';
import { Button } from '../ui/button';
import { Droplets, LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export function Navbar({ user, onLogout }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Droplets className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 bg-clip-text text-transparent">Ruwan Tanki</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate(user.role === 'buyer' ? '/buyer' : '/supplier')}
                className="rounded-full"
              >
                <UserIcon className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  onLogout();
                  navigate('/');
                }}
                className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/auth">Login</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
