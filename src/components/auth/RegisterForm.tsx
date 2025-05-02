
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Mail } from "lucide-react";

interface RegisterFormProps {
  onToggleForm: () => void;
}

export function RegisterForm({ onToggleForm }: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }
    
    if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    
    setPasswordError("");
    setLoading(true);
    
    try {
      await register(email, password);
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
        <CardTitle className="text-center">Crear Cuenta</CardTitle>
        <CardDescription className="text-center">
          Regístrate para usar todas las funciones de Quitar Fondo Pro
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
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {passwordError && (
              <p className="text-sm font-medium text-destructive">{passwordError}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            <Mail className="mr-2 h-4 w-4" />
            {loading ? "Registrando..." : "Registrarse con Email"}
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
          {loading ? "Cargando..." : "Registrarse con Google"}
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          variant="link"
          onClick={onToggleForm}
          disabled={loading}
        >
          ¿Ya tienes una cuenta? Inicia sesión
        </Button>
      </CardFooter>
    </Card>
  );
}
