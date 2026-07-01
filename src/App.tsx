import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import BuyerDashboard from './pages/BuyerDashboard';
import SupplierDashboard from './pages/SupplierDashboard';
import { useAuth, User, AuthProvider } from './lib/mock-db';
import { Navbar } from './components/layout/Navbar';
import { Toaster } from './components/ui/sonner';

function PrivateRoute({ children, role }: { children: React.ReactNode, role?: 'buyer' | 'supplier' }) {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/auth" />;
  if (role && user.role !== role) return <Navigate to={user.role === 'buyer' ? '/buyer' : '/supplier'} />;
  
  return <>{children}</>;
}

function AppContent() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col scroll-smooth">
      <Navbar user={user} onLogout={logout} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route 
            path="/buyer" 
            element={
              <PrivateRoute role="buyer">
                <BuyerDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/supplier" 
            element={
              <PrivateRoute role="supplier">
                <SupplierDashboard />
              </PrivateRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <footer className="bg-muted py-8 px-4 border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 bg-clip-text text-transparent">Ruwan Tanki</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Ruwan Tanki. Connecting communities to essential resources.</p>
          <div className="flex gap-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</Link>
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <Toaster position="top-center" />
      </AuthProvider>
    </Router>
  );
}

export default App;
