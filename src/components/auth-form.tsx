"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Building2 } from "lucide-react";

interface AuthFormProps {
  type: "login" | "signup";
}

export function AuthForm({ type }: AuthFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder for actual auth logic
    if (type === "login") {
      // Simulate login and redirect
      window.location.href = "/dashboard";
    } else {
      // Simulate signup and redirect
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Building2 className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">
            {type === "login" ? "Bem-vindo de volta!" : "Crie sua conta"}
          </CardTitle>
          <CardDescription className="font-body">
            {type === "login"
              ? "Acesse sua conta Construtor Pro."
              : "Preencha os campos para iniciar."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {type === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" type="text" placeholder="Seu nome completo" required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seuemail@exemplo.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="Sua senha" required />
            </div>
            {type === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Senha</Label>
                <Input id="confirm-password" type="password" placeholder="Confirme sua senha" required />
              </div>
            )}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {type === "login" ? "Entrar" : "Cadastrar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center">
          {type === "login" && (
            <Link href="#" className="text-sm text-primary hover:underline">
              Esqueceu sua senha?
            </Link>
          )}
          <p className="text-sm text-muted-foreground">
            {type === "login"
              ? "Não tem uma conta?"
              : "Já possui uma conta?"}{" "}
            <Link href={type === "login" ? "/signup" : "/"} className="font-semibold text-primary hover:underline">
              {type === "login" ? "Cadastre-se" : "Faça login"}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
