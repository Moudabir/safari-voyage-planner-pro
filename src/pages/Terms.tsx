import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import safariLogo from "@/assets/safari-logo.png";

const Terms = () => {
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

      {/* Terms of Service Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-safari-green">Terms of Service</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Service Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Safari is a travel planning platform designed to help groups organize trips, manage expenses, 
              and coordinate schedules. By using our service, you agree to use it responsibly and lawfully.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Responsibilities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Users are responsible for the accuracy of information they provide and for maintaining 
              the security of their account credentials. You must not use the service for any illegal activities.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Safari provides the platform "as is" and cannot be held liable for any travel-related 
              decisions or outcomes based on information managed through our service.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;