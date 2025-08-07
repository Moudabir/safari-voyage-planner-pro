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
  return <div className="min-h-screen font-roboto bg-slate-200">
      {/* Navigation */}
      <nav className="border-b border-white/10 sticky top-0 z-50 backdrop-blur-md bg-white/5 mx-4 my-4 rounded-2xl shadow-lg">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="relative">
                <img src={safariLogo} alt="Safari" className="h-10 w-10 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-safari-orange rounded-full animate-ping"></div>
              </div>
              <span className="text-lg font-bold text-safari-green font-roboto">Safari</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button onClick={() => navigate("/auth")} className="bg-gradient-to-r from-safari-green to-safari-green/80 hover:from-safari-green/90 hover:to-safari-green/70 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-safari text-white py-24 px-4 overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl animate-bounce delay-1000">✈️</div>
          <div className="absolute top-32 right-20 text-4xl animate-pulse delay-2000">🗺️</div>
          <div className="absolute bottom-40 left-20 text-5xl animate-bounce delay-3000">🎒</div>
          <div className="absolute bottom-20 right-10 text-3xl animate-pulse delay-500">📸</div>
          <div className="absolute top-40 left-1/2 text-4xl animate-bounce delay-4000">🌍</div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <Badge className="mb-8 bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 transition-all duration-300 animate-fade-in">
            ✨ Your Ultimate Travel Companion
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight font-roboto animate-fade-in">
            Plan Your Perfect
            <span className="block text-safari-cream relative">
              Safari Adventure
              <div className="absolute -top-2 -right-8 text-4xl animate-spin">🧭</div>
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90 animate-fade-in delay-300">
            Organize group trips like a pro with intelligent attendee tracking, 
            smart budget management, and collaborative itinerary planning.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in delay-500">
            <Button size="lg" onClick={() => navigate("/auth")} className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-safari-green text-lg px-10 py-8 h-auto transition-all duration-300 hover:scale-105 shadow-2xl">
              Start Planning Now
              <MapPin className="ml-3 h-6 w-6" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-10 py-8 h-auto transition-all duration-300 hover:scale-105">
              Watch Demo
              <span className="ml-3 text-2xl">🎬</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-safari-cream/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-safari-green font-roboto">
              Everything You Need for Epic Trips
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From initial planning to final memories, Safari provides all the tools 
              your group needs for unforgettable adventures.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => <Card key={index} className="group border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in" style={{animationDelay: `${index * 150}ms`}}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-safari-green/20 backdrop-blur-sm rounded-xl group-hover:bg-safari-green/30 transition-all duration-300 group-hover:scale-110">
                      <feature.icon className="h-7 w-7 text-safari-green group-hover:text-white transition-colors duration-300" />
                    </div>
                    <CardTitle className="text-safari-green group-hover:text-safari-green/90 transition-colors duration-300">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">{feature.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-safari-green font-roboto">
              Loved by Travelers Worldwide
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our community says about their Safari experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => <Card key={index} className="group border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 hover:scale-105 animate-fade-in" style={{animationDelay: `${index * 200}ms`}}>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="h-5 w-5 text-safari-orange fill-current animate-pulse" style={{animationDelay: `${i * 100}ms`}} />)}
                  </div>
                  <p className="text-muted-foreground mb-4 italic group-hover:text-foreground transition-colors duration-300">"{testimonial.text}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-safari-green to-safari-orange rounded-full flex items-center justify-center text-white font-bold animate-pulse">
                      {testimonial.name.charAt(0)}
                    </div>
                    <p className="font-semibold text-safari-green font-roboto">— {testimonial.name}</p>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-safari text-white py-24 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 text-8xl opacity-20 animate-bounce delay-1000">🎯</div>
          <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-pulse delay-2000">🚀</div>
          <div className="absolute top-1/2 left-10 text-4xl opacity-30 animate-spin delay-3000">⭐</div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 font-roboto animate-fade-in">
            Ready to Plan Your Next Adventure?
            <span className="block text-3xl mt-4 opacity-90">🌟 Join the Journey 🌟</span>
          </h2>
          <p className="text-xl mb-10 opacity-90 animate-fade-in delay-300">
            Join thousands of travelers who trust Safari to organize their perfect trips.
            Start planning today and make memories that last a lifetime.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white hover:text-safari-green text-xl px-16 py-10 h-auto transition-all duration-500 hover:scale-110 shadow-2xl animate-fade-in delay-500">
            Start Your Journey
            <MapPin className="ml-4 h-7 w-7" />
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-safari-cream/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-safari-green font-roboto">
              Get in Touch
            </h2>
            <p className="text-xl text-muted-foreground">
              Have questions? We're here to help you plan the perfect adventure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-center transition-all duration-500 hover:scale-105 animate-fade-in">
              <CardHeader>
                <div className="mx-auto p-4 bg-safari-green/20 backdrop-blur-sm rounded-full w-fit group-hover:bg-safari-green/30 transition-all duration-300 group-hover:scale-110">
                  <Mail className="h-8 w-8 text-safari-green group-hover:text-white transition-colors duration-300" />
                </div>
                <CardTitle className="text-safari-green">Email Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 group-hover:text-foreground transition-colors duration-300">Get support or share feedback</p>
                <p className="font-semibold text-safari-green font-roboto">Mo.moudabir@gmail.com</p>
              </CardContent>
            </Card>

            <Card className="group border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-center transition-all duration-500 hover:scale-105 animate-fade-in delay-200">
              <CardHeader>
                <div className="mx-auto p-4 bg-safari-orange/20 backdrop-blur-sm rounded-full w-fit group-hover:bg-safari-orange/30 transition-all duration-300 group-hover:scale-110">
                  <Phone className="h-8 w-8 text-safari-orange group-hover:text-white transition-colors duration-300" />
                </div>
                <CardTitle className="text-safari-green">Call Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 group-hover:text-foreground transition-colors duration-300">Speak with our travel experts</p>
                <p className="font-semibold text-safari-green font-roboto">Soon</p>
              </CardContent>
            </Card>

            <Card className="group border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-center transition-all duration-500 hover:scale-105 animate-fade-in delay-400">
              <CardHeader>
                <div className="mx-auto p-4 bg-safari-brown/20 backdrop-blur-sm rounded-full w-fit group-hover:bg-safari-brown/30 transition-all duration-300 group-hover:scale-110">
                  <MapIcon className="h-8 w-8 text-safari-brown group-hover:text-white transition-colors duration-300" />
                </div>
                <CardTitle className="text-safari-green">Visit Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 group-hover:text-foreground transition-colors duration-300">Come say hello in person</p>
                <p className="font-semibold text-safari-green font-roboto">Marrakech, MA</p>
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
              <span className="text-lg font-bold text-safari-green font-roboto">Safari</span>
            </div>
            <div className="flex items-center space-x-6">
              <button onClick={() => navigate("/privacy")} className="text-muted-foreground hover:text-safari-green transition-colors">
                Privacy
              </button>
              <button onClick={() => navigate("/terms")} className="text-muted-foreground hover:text-safari-green transition-colors">
                Terms
              </button>
              <button onClick={() => navigate("/support")} className="text-muted-foreground hover:text-safari-green transition-colors">
                Support
              </button>
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