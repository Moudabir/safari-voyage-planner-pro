import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapIcon } from "lucide-react";
import safariLogo from "@/assets/safari-logo.png";

const Support = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src={safariLogo} alt="Safari" className="h-10 w-10" />
              <Button variant="ghost" onClick={() => navigate("/")} className="text-lg font-bold text-safari-green p-0">
                Safari
              </Button>
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

      {/* Support Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-safari-green">Support Center</h1>
          <p className="text-xl text-muted-foreground">
            We're here to help you plan amazing adventures
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="border-safari-sand bg-gradient-to-br from-card to-safari-cream/50 text-center">
            <CardHeader>
              <div className="mx-auto p-3 bg-safari-green/10 rounded-full w-fit">
                <Mail className="h-8 w-8 text-safari-green" />
              </div>
              <CardTitle className="text-safari-green">Email Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Get help with your account or trips</p>
              <p className="font-semibold text-safari-green">Mo.moudabir@gmail.com</p>
            </CardContent>
          </Card>

          <Card className="border-safari-sand bg-gradient-to-br from-card to-safari-cream/50 text-center">
            <CardHeader>
              <div className="mx-auto p-3 bg-safari-orange/10 rounded-full w-fit">
                <Phone className="h-8 w-8 text-safari-orange" />
              </div>
              <CardTitle className="text-safari-green">Phone Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Speak with our travel experts</p>
              <p className="font-semibold text-safari-green">Coming Soon</p>
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
              <p className="font-semibold text-safari-green">Marrakech, Morocco</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-safari-green">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">How do I create a new trip?</h3>
              <p className="text-muted-foreground">Sign up for an account and click "Create New Trip" from your dashboard to get started.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I invite others to collaborate on my trip?</h3>
              <p className="text-muted-foreground">Yes! Use the attendee management feature to invite friends and family to join your trip planning.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How does expense splitting work?</h3>
              <p className="text-muted-foreground">Add expenses to your trip and Safari will automatically calculate fair splits among all attendees.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Support;