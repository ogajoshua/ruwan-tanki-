import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplets, Truck, Users, ArrowRight, ShieldCheck, MapPin, Clock, Search, ClipboardCheck } from 'lucide-react';

const HERO_IMAGE = "https://storage.googleapis.com/dala-prod-public-storage/generated-images/abaca239-bf6d-4103-9824-72e9a2095d28/hero-landing-water-d8bc00d5-1782297449237.webp";

export default function Landing() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center pt-16">
        <div className="absolute inset-0 z-0">
          <img 
            src={HERO_IMAGE} 
            alt="Hero" 
            className="w-full h-full object-cover brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Clean Water, <span className="text-blue-400">Delivered</span> to Your Doorstep.
            </h1>
            <p className="text-base sm:text-xl text-gray-200 mb-8 leading-relaxed">
              The fastest way to connect with local water suppliers. Whether you need a 2,000L tank for your home or 20,000L for your business, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25" asChild>
                <Link to="/auth?mode=signup&role=buyer">
                  Order Water Now <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full bg-emerald-500/20 backdrop-blur-sm border-emerald-400/40 hover:bg-emerald-500/30 text-emerald-100 hover:text-white" asChild>
                <Link to="/auth?mode=signup&role=supplier">
                  Become a Supplier
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Choice Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Choose Your Path</h2>
            <p className="text-muted-foreground text-lg">We provide solutions for both buyers and suppliers.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-background p-8 rounded-3xl border shadow-xl flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">I am a Buyer</h3>
              <p className="text-muted-foreground mb-8">
                Find the best water prices in your area, track your delivery in real-time, and manage your water needs effortlessly.
              </p>
              <Button size="lg" className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white" asChild>
                <Link to="/auth?mode=signup&role=buyer">Join as Buyer</Link>
              </Button>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-background p-8 rounded-3xl border shadow-xl flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">I am a Supplier</h3>
              <p className="text-muted-foreground mb-8">
                Grow your water business, reach more customers, and manage your orders and fleet through our professional dashboard.
              </p>
              <Button size="lg" className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
                <Link to="/auth?mode=signup&role=supplier">Join as Supplier</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Get water delivered in 3 simple steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0 }} className="text-center space-y-4">
              <div className="bg-primary text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center mx-auto text-xl font-bold">1</div>
              <div className="bg-background w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-bold">Find a Supplier</h4>
              <p className="text-muted-foreground">Browse verified water suppliers in your area and compare prices.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="text-center space-y-4">
              <div className="bg-primary text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center mx-auto text-xl font-bold">2</div>
              <div className="bg-background w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <ClipboardCheck className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-bold">Place Your Order</h4>
              <p className="text-muted-foreground">Select tank size, confirm delivery details, and place your order instantly.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-center space-y-4">
              <div className="bg-primary text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center mx-auto text-xl font-bold">3</div>
              <div className="bg-background w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-bold">Receive Delivery</h4>
              <p className="text-muted-foreground">Track your delivery in real-time and receive clean water at your doorstep.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col gap-4">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold">Verified Suppliers</h4>
              <p className="text-muted-foreground">Every supplier on our platform is vetted for quality and reliability.</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold">Real-time Location</h4>
              <p className="text-muted-foreground">See suppliers near you and track your delivery in real-time.</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold">Fast Delivery</h4>
              <p className="text-muted-foreground">Most orders are delivered within 4 hours of confirmation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Join hundreds of buyers and suppliers already using Ruwan Tanki to manage their water needs efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg" asChild>
              <Link to="/auth?mode=signup&role=buyer">Order Water Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-emerald-300/50 hover:bg-emerald-400/20 text-emerald-100 hover:text-white" asChild>
              <Link to="/auth?mode=signup&role=supplier">Become a Supplier</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
