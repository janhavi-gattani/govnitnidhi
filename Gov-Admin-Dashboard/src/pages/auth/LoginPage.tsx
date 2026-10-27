import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle } from "lucide-react";

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username, password);
      // Wait a bit for auth context to update, then redirect based on role
      setTimeout(() => {
        const nextUser = JSON.parse(localStorage.getItem("currentUser") || "null");
        if (nextUser?.role === "gram_panchayat_admin") {
          navigate("/gram-panchayat");
        } else if (nextUser?.role === "zilla_parishad_admin") {
          navigate("/zilla-parishad");
        } else {
          navigate("/");
        }
      }, 100);
    } catch (err: any) {
      setError("Invalid credentials or server error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-center">Admin Login</h1>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Sign in as Gram Panchayat or Zilla Parishad admin
          </p>
        </div>
        {error && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <div className="text-xs text-muted-foreground text-center">
          Example Gram Panchayat admin: <code>vaibhav / IITBOMBAY1234</code>
        </div>
      </Card>
    </div>
  );
}


