import { useState, useMemo } from 'react';
import { mockDb, useAuth, WaterListing, Order } from '../lib/mock-db';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Search, MapPin, Truck, Droplets, History, ShoppingCart, CheckCircle2, Clock, XCircle, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const BG_IMAGE = "https://storage.googleapis.com/dala-prod-public-storage/generated-images/abaca239-bf6d-4103-9824-72e9a2095d28/dashboard-bg-water-d1e7dcab-1782297448658.webp";

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [listings, setListings] = useState(mockDb.getListings());
  const [orders, setOrders] = useState(mockDb.getOrders().filter(o => o.buyerId === user?.id));
  const [selectedListing, setSelectedListing] = useState<WaterListing | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [hoverRating, setHoverRating] = useState<{orderId: string, rating: number} | null>(null);
  
  const [orderForm, setOrderForm] = useState({
    address: user?.address || '',
    phone: user?.phone || '',
  });

  const filteredListings = useMemo(() => {
    return listings.filter(l => 
      l.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.deliveryArea.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [listings, searchTerm]);

  const handlePlaceOrder = () => {
    if (!selectedListing || !user) return;
    
    if (!orderForm.address || !orderForm.phone) {
      toast.error('Please provide delivery details');
      return;
    }

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      buyerId: user.id,
      buyerName: user.name,
      supplierId: selectedListing.supplierId,
      listingId: selectedListing.id,
      tankSize: selectedListing.tankSize,
      price: selectedListing.price,
      status: 'pending',
      createdAt: new Date().toISOString(),
      address: orderForm.address,
      phone: orderForm.phone,
    };

    const allOrders = mockDb.getOrders();
    mockDb.saveOrders([...allOrders, newOrder]);
    
    setOrders(prev => [newOrder, ...prev]);
    setIsOrderModalOpen(false);
    toast.success('Order placed successfully!');
  };

  const handleRateOrder = (orderId: string, rating: number) => {
    const allOrders = mockDb.getOrders();
    const updated = allOrders.map(o => o.id === orderId ? { ...o, rating } : o);
    mockDb.saveOrders(updated);
    setOrders(updated.filter(o => o.buyerId === user?.id));
    setHoverRating(null);
    toast.success('Thank you for your rating!');
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
    <div className="min-h-screen">
      <div className="h-64 relative overflow-hidden">
        <img src={BG_IMAGE} className="w-full h-full object-cover" alt="Dashboard background" />
        <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm flex items-center px-4">
          <div className="max-w-7xl mx-auto w-full text-white px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Welcome back, {user?.name}</h1>
            <p className="text-blue-100 text-sm sm:text-base md:text-lg">Find the best water deals in your area.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 pb-12 relative z-10">
        <Tabs defaultValue="explore" className="w-full">
          <TabsList className="bg-background shadow-lg p-1 h-auto rounded-2xl border">
            <TabsTrigger value="explore" className="rounded-xl py-3 px-8 text-base">
              <ShoppingCart className="w-4 h-4 mr-2" /> Explore
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-xl py-3 px-8 text-base">
              <History className="w-4 h-4 mr-2" /> My Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="mt-8 space-y-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Search by supplier or delivery area..." 
                className="pl-12 h-14 rounded-2xl shadow-lg text-lg bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.length > 0 ? (
                filteredListings.map(listing => (
                  <Card key={listing.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-primary/10 rounded-3xl">
                    <CardHeader className="bg-muted/30 pb-4">
                      <div className="flex justify-between items-start">
                        <div className="bg-primary/10 p-2 rounded-xl">
                          <Droplets className="w-6 h-6 text-primary" />
                        </div>
                        <Badge variant="secondary" className="bg-white/80 backdrop-blur">Available</Badge>
                      </div>
                      <CardTitle className="mt-4">{listing.supplierName}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {listing.deliveryArea}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Tank Size</p>
                            <p className="text-2xl font-bold">{listing.tankSize.toLocaleString()} Liters</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground mb-1">Price</p>
                            <p className="text-3xl font-black text-primary">₦{listing.price}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button 
                        className="w-full py-6 rounded-2xl text-base font-semibold" 
                        onClick={() => {
                          setSelectedListing(listing);
                          setIsOrderModalOpen(true);
                        }}
                      >
                        Order Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold">No suppliers found</h3>
                  <p className="text-muted-foreground">Try searching for a different area or supplier name.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-8">
            <div className="grid gap-4">
              {orders.length > 0 ? (
                orders.map(order => (
                  <Card key={order.id} className="overflow-hidden border-primary/10 rounded-2xl hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                      <div className="bg-primary/10 p-4 rounded-2xl">
                        <Droplets className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-grow text-center md:text-left">
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold">Order #{order.id}</h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-muted-foreground">
                          {order.tankSize.toLocaleString()}L from <span className="text-foreground font-medium">{order.supplierId}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-center md:text-right">
                        <p className="text-2xl font-bold">₦{order.price}</p>
                        <p className="text-sm text-muted-foreground">{order.address}</p>
                      </div>
                    </div>
                    {order.status === 'delivered' && (
                      <div className="border-t pt-4 mt-2">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                          <span className="text-sm font-medium text-muted-foreground">Rate this delivery:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => handleRateOrder(order.id, star)}
                                onMouseEnter={() => setHoverRating({ orderId: order.id, rating: star })}
                                onMouseLeave={() => setHoverRating(null)}
                                className="p-1 hover:scale-110 transition-transform"
                              >
                                <Star
                                  className={`w-5 h-5 transition-colors ${
                                    (hoverRating?.orderId === order.id && star <= hoverRating.rating) || (!hoverRating && order.rating && star <= order.rating)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300 hover:text-yellow-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                          {order.rating && !hoverRating && (
                            <span className="text-sm text-muted-foreground ml-2">({order.rating}/5)</span>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                ))
              ) : (
                <Card className="py-20 text-center border-dashed">
                  <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <History className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-bold">No orders yet</h3>
                  <p className="text-muted-foreground">Your order history will appear here once you place an order.</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Confirm Your Order</DialogTitle>
            <DialogDescription>
              You're ordering {selectedListing?.tankSize.toLocaleString()}L of water from {selectedListing?.supplierName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="bg-primary/5 p-4 rounded-2xl flex justify-between items-center border border-primary/10">
              <span className="font-medium">Total Amount</span>
              <span className="text-2xl font-black text-primary">₦{selectedListing?.price}</span>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="order-address">Delivery Address</Label>
                <Input 
                  id="order-address" 
                  value={orderForm.address} 
                  onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                  placeholder="Street, Building, Unit"
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order-phone">Contact Phone</Label>
                <Input 
                  id="order-phone" 
                  value={orderForm.phone} 
                  onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="rounded-xl h-12"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button className="w-full py-6 rounded-2xl text-lg font-semibold" onClick={handlePlaceOrder}>
              Confirm Order
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setIsOrderModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
