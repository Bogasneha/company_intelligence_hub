import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { BrainCircuit, Lock } from "lucide-react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'azure') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to sign in with ${provider}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-[420px] bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white mb-4 shadow-md">
            <BrainCircuit className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 border-blue-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 border-blue-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 bg-[#00bfa5] hover:bg-[#00a891] text-white font-medium text-base transition-colors"
            disabled={loading}
          >
            <Lock className="w-4 h-4 mr-2" />
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="flex justify-start py-1">
            <a href="#" className="text-sm text-[#00bfa5] hover:underline font-medium">
              Reset password
            </a>
          </div>
        </form>

        <div className="mt-8 mb-6 relative flex items-center justify-center">
          <div className="border-t border-gray-200 w-full absolute" />
          <span className="bg-white px-4 text-sm text-gray-400 relative">or alternatively</span>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuthSignIn('google')}
            className="w-full h-11 border-gray-300 hover:bg-gray-50 bg-white text-gray-700 font-normal justify-center group"
          >
            <svg className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.17v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.17C1.43 8.55 1 10.22 1 12s.43 3.45 1.17 4.94l3.67-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.17 7.06l3.67 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuthSignIn('azure')}
            className="w-full h-11 border-gray-300 hover:bg-gray-50 bg-white text-gray-700 font-normal justify-center group"
          >
            <svg className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" viewBox="0 0 21 21">
              <path d="M10 0H0v10h10V0z" fill="#F25022"/>
              <path d="M21 0H11v10h10V0z" fill="#7FBA00"/>
              <path d="M10 11H0v10h10V11z" fill="#00A4EF"/>
              <path d="M21 11H11v10h10V11z" fill="#FFB900"/>
            </svg>
            Sign in with Microsoft
          </Button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          By signing in you agree to the{" "}
          <a href="#" className="flex-inline text-[#00bfa5] hover:underline">terms</a>
          {" "}and{" "}
          <a href="#" className="flex-inline text-[#00bfa5] hover:underline">privacy policy</a>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-600 border-t border-gray-100 pt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-black hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
