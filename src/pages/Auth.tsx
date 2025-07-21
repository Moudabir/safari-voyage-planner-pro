import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
        navigate("/");
      }
    };
    checkUser();
  }, [navigate]);
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
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
        navigate("/");
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
  const handleSubmit = mode === "signin" ? handleSignIn : handleSignUp;
  return <div className="min-h-screen bg-background flex items-center justify-center p-5">
      <div className="brutalist-card w-full max-w-md">
        <h1 className="brutalist-title">
          {mode === "signin" ? "Sign In" : "Create Account"}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="brutalist-label">
              Email
            </label>
            <input id="email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required className="brutalist-input" />
          </div>
          
          <div>
            <label htmlFor="password" className="brutalist-label">
              Password
            </label>
            <input id="password" type="password" placeholder={mode === "signup" ? "Create a password (min 6 characters)" : "Enter your password"} value={password} onChange={e => setPassword(e.target.value)} required minLength={mode === "signup" ? 6 : undefined} className="brutalist-input" />
          </div>
          
          <button type="submit" disabled={loading} className="brutalist-button mt-4">
            {loading ? mode === "signin" ? "Signing In..." : "Creating Account..." : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="flex items-center my-6 text-foreground font-bold">
          <div className="flex-1 border-b-2 border-primary mr-3"></div>
          <span>OR</span>
          <div className="flex-1 border-b-2 border-primary ml-3"></div>
        </div>

        <div className="text-center">
          <p className="text-foreground mb-4">
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button type="button" onClick={() => {
          setMode(mode === "signin" ? "signup" : "signin");
          setEmail("");
          setPassword("");
        }} className="brutalist-button bg-secondary text-foreground border-2 border-primary hover:shadow-brutal-hover hover:-translate-x-0.5 hover:-translate-y-0.5">
            {mode === "signin" ? "Create New Account" : "Sign In Instead"}
          </button>
        </div>

        <div className="text-center mt-5">
          <p className="text-foreground">
            <strong>Safari Trip Planner</strong>
          </p>
          <p className="text-foreground text-sm mt-1">Dreb lik a7san tsafira w thenna.</p>
        </div>
      </div>
    </div>;
};
export default Auth;