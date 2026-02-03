import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface LoginProps {
    passwordInput: string;
    setPasswordInput: (value: string) => void;
    handleLogin: (e: React.FormEvent) => void;
}

export const Login: React.FC<LoginProps> = ({ passwordInput, setPasswordInput, handleLogin }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Helmet>
                <title>Acesso Restrito - Treinos Formação</title>
            </Helmet>
            <Card className="w-full max-w-md shadow-xl border-t-4 border-primary">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Lock className="text-primary w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl">Área de Gestão</CardTitle>
                    <CardDescription>Introduza a password para aceder aos treinos de formação</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            type="password"
                            placeholder="Password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="text-center text-lg tracking-widest"
                            autoFocus
                        />
                        <Button type="submit" className="w-full h-12 text-lg">Entrar</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
