import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Users, Banknote } from "lucide-react";
import safariLogo from "@/assets/safari-logo.png";
const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (session?.user) {
        navigate("/dashboard");
      }
    };
    checkUser();
  }, [navigate]);
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      const {
        error
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      if (error) throw error;
      toast({
        title: "Check your email",
        description: "Please check your email for the confirmation link."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully."
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      const {
        error
      } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const handleSubmit = mode === "signin" ? handleSignIn : handleSignUp;
  return <div className="min-h-screen bg-background flex">
      {/* Left Side - Safari Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-safari text-white p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute top-6 left-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-white hover:bg-white/20 p-2">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-8">
            <img src={safariLogo} alt="Safari" className="h-20 w-20" />
            <div>
              <h1 className="text-4xl font-bold">Safari</h1>
              <p className="text-safari-cream text-lg">Your Ultimate Travel Companion</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl font-bold leading-tight">
              Turn Your Travel Dreams Into Reality
            </h2>
            <p className="text-xl opacity-90">
              Join thousands of adventurers who trust Safari to organize unforgettable group trips. 
              From budget tracking to itinerary planning, we've got everything covered.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-safari-cream" />
                <span className="text-lg">Smart attendee management</span>
              </div>
              <div className="flex items-center space-x-3">
                <Banknote className="h-6 w-6 text-safari-cream" />
                <span className="text-lg">Transparent budget tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-6 w-6 text-safari-cream" />
                <span className="text-lg">Collaborative trip planning</span>
              </div>
            </div>
            
            <div className="pt-6">
              <p className="text-safari-cream text-lg italic">
                "Safari made organizing our 20-person Morocco adventure effortless!"
              </p>
              <p className="text-sm opacity-75 mt-2">— Sarah, Adventure Enthusiast</p>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-safari-cream/20 rounded-full"></div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        {/* Mobile back button */}
        <div className="absolute top-4 left-4 lg:hidden">
          <Button variant="ghost" onClick={() => navigate("/")} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="brutalist-card w-full max-w-md">
          <h1 className="brutalist-title">
            Dkhol
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="brutalist-label">Dak lEmail</label>
              <input id="email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required className="brutalist-input" />
            </div>
            
            <div>
              <label htmlFor="password" className="brutalist-label">Secret Password</label>
              <input id="password" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required minLength={mode === "signup" ? 6 : undefined} className="brutalist-input" />
            </div>
            
            <button type="submit" disabled={loading} className="brutalist-button mt-4 bg-orange-700 hover:bg-orange-600">
              Dkhol mn hna
            </button>
          </form>

          <div className="flex items-center my-6 text-foreground font-bold">
            <div className="flex-1 border-b-2 border-primary mr-3"></div>
            <span>Wla</span>
            <div className="flex-1 border-b-2 border-primary ml-3"></div>
          </div>

          <div className="text-center">
            <p className="text-foreground mb-4">
              Don't have an account?
            </p>
            <button type="button" onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setEmail("");
            setPassword("");
          }} className="brutalist-button bg-secondary text-foreground border-2 border-primary hover:shadow-brutal-hover hover:-translate-x-0.5 hover:-translate-y-0.5">
              Create New Account
            </button>
          </div>

          <div className="text-center mt-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <img src={safariLogo} alt="Safari" className="h-8 w-8" />
              <span className="text-lg font-bold text-safari-green">Safari Trip Planner</span>
            </div>
            <p className="text-foreground text-sm">chi ssafra zia 78ha wri95ha</p>
          </div>
        </div>
      </div>
    </div>;
};
export default Auth;