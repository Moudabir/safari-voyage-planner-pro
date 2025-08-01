import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Banknote, Calendar, Globe, Shield, Zap, Star, Mail, Phone, MapIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import safariLogo from "@/assets/safari-logo.png";
const Home = () => {
  const navigate = useNavigate();
  const features = [{
    icon: Users,
    title: "Smart Attendee Management",
    description: "Effortlessly track who's joining your adventure with real-time confirmations and contact management."
  }, {
    icon: Banknote,
    title: "Intelligent Budget Tracking",
    description: "Split expenses fairly among travelers with automated calculations and transparent cost breakdowns."
  }, {
    icon: Calendar,
    title: "Dynamic Schedule Planning",
    description: "Create detailed itineraries with time management, location tracking, and photo memories."
  }, {
    icon: Globe,
    title: "Multi-Trip Organization",
    description: "Manage multiple adventures simultaneously with easy trip switching and data separation."
  }, {
    icon: Shield,
    title: "Secure Data Management",
    description: "Your travel data is protected with enterprise-grade security and privacy controls."
  }, {
    icon: Zap,
    title: "Real-time Collaboration",
    description: "Work together with your travel group in real-time with instant updates and notifications."
  }];
  const testimonials = [{
    name: "Sarah Johnson",
    text: "Safari made organizing our 15-person Morocco trip so easy! The expense tracking saved us hours of calculations.",
    rating: 5
  }, {
    name: "Mike Chen",
    text: "The best travel planning tool I've ever used. Everything in one place, beautifully designed.",
    rating: 5
  }, {
    name: "Emma Williams",
    text: "Our group loved how transparent the budget tracking was. No more awkward money conversations!",
    rating: 5
  }];
  return <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src={safariLogo} alt="Safari" className="h-10 w-10" />
              
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button onClick={() => navigate("/auth")} className="bg-safari-green hover:bg-safari-green/90 text-white">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-safari text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
            🎯 Your Ultimate Travel Companion
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Plan Your Perfect
            <span className="block text-safari-cream">Safari Adventure</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Organize group trips like a pro with intelligent attendee tracking, 
            smart budget management, and collaborative itinerary planning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")} className="bg-white text-safari-green hover:bg-white/90 text-lg px-8 py-6 h-auto">
              Start Planning Now
              <MapPin className="ml-2 h-5 w-5" />
            </Button>
            
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-safari-cream/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-safari-green">
              Everything You Need for Epic Trips
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From initial planning to final memories, Safari provides all the tools 
              your group needs for unforgettable adventures.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => <Card key={index} className="border-safari-sand bg-gradient-to-br from-card to-safari-cream/50 hover:shadow-safari transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-safari-green/10 rounded-lg">
                      <feature.icon className="h-6 w-6 text-safari-green" />
                    </div>
                    <CardTitle className="text-safari-green">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-safari-green">
              Loved by Travelers Worldwide
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our community says about their Safari experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => <Card key={index} className="border-safari-sand bg-gradient-to-br from-card to-safari-cream/30">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="h-5 w-5 text-safari-orange fill-current" />)}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <p className="font-semibold text-safari-green">— {testimonial.name}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-safari text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Plan Your Next Adventure?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of travelers who trust Safari to organize their perfect trips.
            Start planning today and make memories that last a lifetime.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="bg-white text-safari-green hover:bg-white/90 text-xl px-12 py-8 h-auto">
            Start Your Journey
            <MapPin className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-safari-cream/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-safari-green">
              Get in Touch
            </h2>
            <p className="text-xl text-muted-foreground">
              Have questions? We're here to help you plan the perfect adventure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-safari-sand bg-gradient-to-br from-card to-safari-cream/50 text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-safari-green/10 rounded-full w-fit">
                  <Mail className="h-8 w-8 text-safari-green" />
                </div>
                <CardTitle className="text-safari-green">Email Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Get support or share feedback</p>
                <p className="font-semibold text-safari-green">hello@safari-trips.com</p>
              </CardContent>
            </Card>

            <Card className="border-safari-sand bg-gradient-to-br from-card to-safari-cream/50 text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-safari-orange/10 rounded-full w-fit">
                  <Phone className="h-8 w-8 text-safari-orange" />
                </div>
                <CardTitle className="text-safari-green">Call Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Speak with our travel experts</p>
                <p className="font-semibold text-safari-green">+1 (555) 123-TRIP</p>
              </CardContent>
            </Card>

            <Card className="border-safari-sand bg-gradient-to-br from-card to-safari-cream/50 text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-safari-brown/10 rounded-full w-fit">
                  <MapIcon className="h-8 w-8 text-safari-brown" />
                </div>
                <CardTitle className="text-safari-green">Visit Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Come say hello in person</p>
                <p className="font-semibold text-safari-green">San Francisco, CA</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img src={safariLogo} alt="Safari" className="h-8 w-8" />
              <span className="text-lg font-bold text-safari-green">Safari</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-muted-foreground hover:text-safari-green transition-colors">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-safari-green transition-colors">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-safari-green transition-colors">
                Support
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-muted-foreground">
              © 2024 Safari. Made with ❤️ for adventurous travelers.
            </p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Home;