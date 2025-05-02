
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Mail } from "lucide-react";

interface LoginFormProps {
  onToggleForm: () => void;
}

export function LoginForm({ onToggleForm }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Iniciar Sesión</CardTitle>
        <CardDescription className="text-center">
          Inicia sesión para acceder a todas las funciones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            <Mail className="mr-2 h-4 w-4" />
            {loading ? "Iniciando sesión..." : "Iniciar sesión con Email"}
          </Button>
        </form>
        
        <div className="mt-4 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-[#2A2F3C] text-muted-foreground">
              O continuar con
            </span>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={handleGoogleLogin}
          className="w-full mt-4"
          disabled={loading}
        >
          <Smartphone className="mr-2 h-4 w-4" />
          {loading ? "Cargando..." : "Iniciar sesión con Google"}
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          variant="link"
          onClick={onToggleForm}
          disabled={loading}
        >
          ¿No tienes una cuenta? Regístrate
        </Button>
      </CardFooter>
    </Card>
  );
}
