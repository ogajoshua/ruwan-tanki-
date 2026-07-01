import { useState, useMemo } from 'react';
import { mockDb, useAuth, WaterListing, Order } from '../lib/mock-db';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Plus, Trash2, Droplets, Package, ClipboardList, CheckCircle2, Clock, XCircle, Truck, MapPin, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function SupplierDashboard() {
  const { user } = useAuth();
  const [listings, setListings] = useState(mockDb.getListings().filter(l => l.supplierId === user?.id));
  const [orders, setOrders] = useState(mockDb.getOrders().filter(o => o.supplierId === user?.id));
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newListing, setNewListing] = useState({
    tankSize: '',
    price: '',
    deliveryArea: user?.address || '',
  });

  const stats = useMemo(() => {
    const deliveredOrders = orders.filter(o => o.status === 'delivered');
    const ratedOrders = deliveredOrders.filter(o => o.rating);
    const avgRating = ratedOrders.length > 0 ? ratedOrders.reduce((sum, o) => sum + (o.rating || 0), 0) / ratedOrders.length : 0;
    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      revenue: deliveredOrders.reduce((sum, o) => sum + o.price, 0),
      activeListings: listings.length,
      avgRating: avgRating,
      totalRatings: ratedOrders.length
    };
  }, [orders, listings]);

  const handleAddListing = () => {
    if (!user) return;
    if (!newListing.tankSize || !newListing.price || !newListing.deliveryArea) {
      toast.error('Please fill in all fields');
      return;
    }

    const listing: WaterListing = {
      id: Math.random().toString(36).substr(2, 9),
      supplierId: user.id,
      supplierName: user.name,
      tankSize: Number(newListing.tankSize),
      price: Number(newListing.price),
      deliveryArea: newListing.deliveryArea,
      available: true,
    };

    const allListings = mockDb.getListings();
    mockDb.saveListings([...allListings, listing]);
    setListings(prev => [...prev, listing]);
    setIsAddModalOpen(false);
    setNewListing({ tankSize: '', price: '', deliveryArea: user.address || '' });
    toast.success('Listing added successfully!');
  };

  const handleDeleteListing = (id: string) => {
    const updated = listings.filter(l => l.id !== id);
    const allListings = mockDb.getListings().filter(l => l.id !== id);
    mockDb.saveListings(allListings);
    setListings(updated);
    toast.success('Listing removed');
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const allOrders = mockDb.getOrders();
    const updated = allOrders.map(o => o.id === orderId ? { ...o, status } : o);
    mockDb.saveOrders(updated);
    setOrders(updated.filter(o => o.supplierId === user?.id));
    toast.success(`Order marked as ${status}`);
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200 capitalize"><Clock className="w-3 h-3 mr-1" /> {status}</Badge>;
      case 'accepted': return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 capitalize"><Truck className="w-3 h-3 mr-1" /> {status}</Badge>;
      case 'delivered': return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 capitalize"><CheckCircle2 className="w-3 h-3 mr-1" /> {status}</Badge>;
      case 'rejected': return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 capitalize"><XCircle className="w-3 h-3 mr-1" /> {status}</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Supplier Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your water business and track deliveries.</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl py-5 px-5 shadow-lg shadow-primary/20 text-sm sm:text-base">
              <Plus className="w-5 h-5 mr-2" /> Add New Listing
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl">
            <DialogHeader>
              <DialogTitle>Add Water Listing</DialogTitle>
              <DialogDescription>Create a new water tank offering for your customers.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Tank Size (Liters)</Label>
                <Input 
                  type="number" 
                  placeholder="5000" 
                  value={newListing.tankSize}
                  onChange={e => setNewListing({ ...newListing, tankSize: e.target.value })}
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label>Price (₦)</Label>
                <Input 
                  type="number" 
                  placeholder="150" 
                  value={newListing.price}
                  onChange={e => setNewListing({ ...newListing, price: e.target.value })}
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label>Delivery Area</Label>
                <Input 
                  placeholder="Downtown Area" 
                  value={newListing.deliveryArea}
                  onChange={e => setNewListing({ ...newListing, deliveryArea: e.target.value })}
                  className="rounded-xl h-12"
                />
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full py-6 rounded-2xl" onClick={handleAddListing}>Publish Listing</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="rounded-3xl border-primary/10 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <div className="bg-green-100 p-2 rounded-lg"><Package className="w-4 h-4 text-green-600" /></div>
            </div>
            <h3 className="text-3xl font-bold">₦{stats.revenue}</h3>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-primary/10 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
              <div className="bg-yellow-100 p-2 rounded-lg"><Clock className="w-4 h-4 text-yellow-600" /></div>
            </div>
            <h3 className="text-3xl font-bold">{stats.pendingOrders}</h3>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-primary/10 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
              <div className="bg-blue-100 p-2 rounded-lg"><ClipboardList className="w-4 h-4 text-blue-600" /></div>
            </div>
            <h3 className="text-3xl font-bold">{stats.totalOrders}</h3>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-primary/10 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-muted-foreground">Active Listings</p>
              <div className="bg-primary/10 p-2 rounded-lg"><Droplets className="w-4 h-4 text-primary" /></div>
            </div>
            <h3 className="text-3xl font-bold">{stats.activeListings}</h3>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-primary/10 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
              <div className="bg-yellow-100 p-2 rounded-lg"><Star className="w-4 h-4 text-yellow-600" /></div>
            </div>
            <h3 className="text-3xl font-bold">{stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '—'}</h3>
            {stats.totalRatings > 0 && <p className="text-xs text-muted-foreground mt-1">{stats.totalRatings} rating{stats.totalRatings !== 1 ? 's' : ''}</p>}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-2xl mb-6">
          <TabsTrigger value="orders" className="rounded-xl px-8 py-3 text-base">Incoming Orders</TabsTrigger>
          <TabsTrigger value="listings" className="rounded-xl px-8 py-3 text-base">My Offerings</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          {orders.length > 0 ? (
            <>
              {/* Mobile card view */}
              <div className="grid gap-4 md:hidden">
                {orders.map(order => (
                  <Card key={order.id} className="rounded-2xl border-primary/10 p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{order.buyerName}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {order.address}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    {order.rating && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{order.rating}/5</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div>
                        <span className="font-medium">{order.tankSize.toLocaleString()}L</span>
                        <span className="text-primary font-bold ml-2">₦{order.price}</span>
                      </div>
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <>
                            <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 rounded-lg text-xs" onClick={() => updateOrderStatus(order.id, 'accepted')}>Accept</Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 rounded-lg text-xs" onClick={() => updateOrderStatus(order.id, 'rejected')}>Reject</Button>
                          </>
                        )}
                        {order.status === 'accepted' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 rounded-lg text-xs" onClick={() => updateOrderStatus(order.id, 'delivered')}>Delivered</Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              {/* Desktop table view */}
              <Card className="rounded-3xl border-primary/10 overflow-hidden hidden md:block">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="font-bold">Order ID</TableHead>
                        <TableHead className="font-bold">Customer</TableHead>
                        <TableHead className="font-bold">Details</TableHead>
                        <TableHead className="font-bold">Status</TableHead>
                        <TableHead className="font-bold">Rating</TableHead>
                        <TableHead className="font-bold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map(order => (
                        <TableRow key={order.id} className="hover:bg-muted/10 transition-colors">
                          <TableCell className="font-mono text-xs">#{order.id}</TableCell>
                          <TableCell>
                            <div className="font-bold">{order.buyerName}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {order.address}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{order.tankSize.toLocaleString()} Liters</div>
                            <div className="text-sm text-primary font-bold">₦{order.price}</div>
                          </TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            {order.rating ? (
                              <div className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><span className="font-medium">{order.rating}</span></div>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {order.status === 'pending' && (
                                <>
                                  <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 rounded-lg" onClick={() => updateOrderStatus(order.id, 'accepted')}>Accept</Button>
                                  <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 rounded-lg" onClick={() => updateOrderStatus(order.id, 'rejected')}>Reject</Button>
                                </>
                              )}
                              {order.status === 'accepted' && (
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 rounded-lg" onClick={() => updateOrderStatus(order.id, 'delivered')}>Mark Delivered</Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </>
          ) : (
            <Card className="rounded-3xl border-dashed py-16 text-center">
              <div className="flex flex-col items-center justify-center">
                <ClipboardList className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                <p className="text-muted-foreground">No orders received yet.</p>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="listings">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <Card key={listing.id} className="rounded-3xl border-primary/10 overflow-hidden group hover:shadow-xl transition-all">
                <CardHeader className="bg-muted/30">
                  <div className="flex justify-between items-center">
                    <div className="bg-primary/10 p-2 rounded-xl"><Droplets className="w-5 h-5 text-primary" /></div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteListing(listing.id)}>
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">{listing.tankSize.toLocaleString()} Liters</h3>
                    <p className="text-2xl font-black text-primary">₦{listing.price}</p>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.deliveryArea}</span>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/10 border-t flex justify-between">
                  <span className="text-xs font-medium text-muted-foreground">ID: {listing.id}</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                </CardFooter>
              </Card>
            ))}
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="border-2 border-dashed border-muted rounded-3xl p-12 flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary group"
            >
              <div className="w-16 h-16 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Plus className="w-8 h-8" />
              </div>
              <span className="font-bold text-lg">Add New Offering</span>
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
