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

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
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
          <span>Wla</span>
          <div className="flex-1 border-b-2 border-primary ml-3"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="brutalist-button w-full mb-6 bg-secondary text-foreground border-2 border-primary hover:shadow-brutal-hover hover:-translate-x-0.5 hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

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