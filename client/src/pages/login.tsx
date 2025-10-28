import { useLocation } from "wouter";
import backgroundImage from "@assets/generated_images/Real_estate_plots_buildings_aerial_f9df5abc.png";

import { Building2, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import type { AuthResponse, LoginCredentials } from "@shared/schema";
import { loginSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  // Clear any old tokens when the login page loads
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LoginCredentials) => {
    try {
      const response = await apiRequest("POST", "/api/auth/login", data);
      const authData: AuthResponse = await response.json();

      login(authData);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      
      // Use window.location for reliable redirect
      window.location.href = "/";
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Animated overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-blue-900/40 to-purple-900/40"></div>
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      
      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse top-0 left-0"></div>
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse bottom-0 right-0 animation-delay-1000"></div>
        <div className="absolute w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 mb-6 shadow-2xl pulse-glow">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white drop-shadow-2xl">
              Plot Management CRM
            </h1>
            <p className="text-white/90 text-lg drop-shadow-lg">
              Your ultimate real estate management solution ✨
            </p>
          </div>
        </div>

        {/* Login Card with Glassmorphism */}
        <Card className="glass shadow-2xl border-2 border-white/20 animate-scale-in">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sign In to Continue
            </CardTitle>
            <CardDescription className="text-base">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="admin@example.com"
                          {...field}
                          data-testid="input-email"
                          disabled={form.formState.isSubmitting}
                          className="h-12 text-base border-2 focus:border-primary/50 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          data-testid="input-password"
                          disabled={form.formState.isSubmitting}
                          className="h-12 text-base border-2 focus:border-primary/50 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  disabled={form.formState.isSubmitting}
                  data-testid="button-login"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-6 text-center glass rounded-xl p-4 border border-white/20 animate-fade-in-up animate-delay-200">
          <p className="text-white/90 font-medium mb-2">✨ Try Demo Accounts ✨</p>
          <div className="space-y-1 text-sm">
            <p className="text-white/80">
              <span className="font-semibold">Admin:</span> admin@example.com / password123
            </p>
            <p className="text-white/80">
              <span className="font-semibold">Salesperson:</span> sales@example.com / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
