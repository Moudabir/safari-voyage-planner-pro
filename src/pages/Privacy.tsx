import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import safariLogo from "@/assets/safari-logo.png";

const Privacy = () => {
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

      {/* Privacy Policy Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-safari-green">Privacy Policy</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Safari collects only the information necessary to provide our travel planning services. 
              This includes trip details, attendee information, and expense data that you voluntarily provide.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your data is used solely to enhance your travel planning experience. We do not sell, 
              rent, or share your personal information with third parties without your explicit consent.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We implement industry-standard security measures to protect your data, including encryption 
              and secure server infrastructure provided by Supabase.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;