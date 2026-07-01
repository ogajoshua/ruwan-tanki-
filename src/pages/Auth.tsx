import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, UserRole } from '../lib/mock-db';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { Droplets } from 'lucide-react';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, login, signup } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'signup'>(
    (searchParams.get('mode') as 'login' | 'signup') || 'login'
  );
  const [role, setRole] = useState<UserRole>(
    (searchParams.get('role') as UserRole) || 'buyer'
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      navigate(user.role === 'buyer' ? '/buyer' : '/supplier');
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'signup') {
      if (!formData.email || !formData.name) {
        toast.error('Please fill in required fields');
        return;
      }
      signup(formData.name, formData.email, role, formData.phone, formData.address);
      toast.success('Account created successfully!');
    } else {
      if (!formData.email) {
        toast.error('Please enter your email');
        return;
      }
      const result = login(formData.email);
      if (result) {
        toast.success(`Welcome back, ${result.name}!`);
      } else {
        toast.error('User not found. Please sign up.');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md shadow-2xl border-primary/10">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Droplets className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </CardTitle>
          <CardDescription>
            {mode === 'login' ? 'Enter your email to sign in' : 'Join our community of water users'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="role">I am a...</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      type="button"
                      variant={role === 'buyer' ? 'default' : 'outline'}
                      onClick={() => setRole('buyer')}
                      className="w-full"
                    >
                      Buyer
                    </Button>
                    <Button 
                      type="button"
                      variant={role === 'supplier' ? 'default' : 'outline'}
                      onClick={() => setRole('supplier')}
                      className="w-full"
                    >
                      Supplier
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@example.com" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {mode === 'signup' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="+1 (555) 000-0000" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Default Address</Label>
                  <Input 
                    id="address" 
                    placeholder="123 Water St, Aquatown" 
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full mt-6 py-6 text-lg font-semibold rounded-xl">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            {mode === 'login' ? (
              <p>Don't have an account? <button onClick={() => setMode('signup')} className="text-primary font-semibold hover:underline">Sign up</button></p>
            ) : (
              <p>Already have an account? <button onClick={() => setMode('login')} className="text-primary font-semibold hover:underline">Log in</button></p>
            )}
          </div>
          <div className="bg-primary/5 p-4 rounded-lg text-xs text-muted-foreground border border-primary/10">
            <p className="font-semibold text-primary mb-1 text-center uppercase tracking-wider">Demo Mode</p>
            <p>For this session, authentication is simulated using localStorage. Just enter an email to login.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
