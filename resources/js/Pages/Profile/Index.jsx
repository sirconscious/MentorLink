import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    User,
    Mail,
    Key,
    Copy,
    Check,
    Shield,
    Eye,
    EyeOff,
    ExternalLink,
    AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DashboardLayout from '../Layouts/DashboardLayout';

export default function Profile({ auth, jellyfinToken }) {
    const [showToken, setShowToken] = useState(false);
    const [copied, setCopied] = useState(false);

    // Fix: Access user from auth.user (from middleware) or directly from auth.user (from controller)
    const user = auth?.user || auth;

    // Fix: Safe role access - handle both middleware and controller formats
    const getRole = () => {
        if (!auth) return null;

        // If auth has roles directly (from controller)
        if (auth.roles && Array.isArray(auth.roles) && auth.roles.length > 0) {
            return auth.roles[0];
        }

        // If auth has roles as separate property (from middleware)
        if (auth.roles && auth.roles) {
            // Convert Laravel Collection to array if needed
            const rolesArray = Array.isArray(auth.roles) ? auth.roles : Array.from(auth.roles || []);
            return rolesArray[0];
        }

        return null;
    };

    const role = getRole();

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Guard clause: if no user data, don't render
    if (!user) {
        return (
            <DashboardLayout>
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No user data</AlertTitle>
                        <AlertDescription>
                            Unable to load profile information. Please try again.
                        </AlertDescription>
                    </Alert>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <Head>
                <title>Your Profile - Jellyfin Access</title>
            </Head>

            <div className="min-h-screen bg-background py-8">
                <div className="container max-w-6xl mx-auto px-4">
                    {/* Header */}
                    {/* <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
                        <p className="text-muted-foreground mt-2">
                            Manage your account and Jellyfin access credentials
                        </p>
                    </div> */}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Account Information
                                    </CardTitle>
                                    <CardDescription>
                                        Your personal details and Jellyfin credentials
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* User Info */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="h-8 w-8 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold">{user.name}</h3>
                                                <p className="text-muted-foreground flex items-center gap-2">
                                                    <Mail className="h-4 w-4" />
                                                    {user.email}
                                                </p>
                                                {role && (
                                                    <Badge variant="outline" className="mt-1">
                                                        {role}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    value={user.name}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input
                                                    id="email"
                                                    value={user.email}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Jellyfin Credentials */}
                                    <div className="pt-6 border-t">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <Shield className="h-5 w-5 text-primary" />
                                                <h4 className="text-lg font-semibold">Jellyfin Access</h4>
                                            </div>
                                            <Badge variant="secondary">Courses Only</Badge>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="jellyfin-username">Jellyfin Username</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        id="jellyfin-username"
                                                        value={user.email}
                                                        readOnly
                                                    />
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => copyToClipboard(user.email)}
                                                    >
                                                        {copied ? (
                                                            <Check className="h-4 w-4" />
                                                        ) : (
                                                            <Copy className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>

                                            {jellyfinToken ? (
                                                <div className="space-y-2">
                                                    <Label htmlFor="jellyfin-token" className="flex items-center gap-2">
                                                        <Key className="h-4 w-4" />
                                                        Jellyfin Password/Token
                                                    </Label>
                                                    <div className="flex gap-2">
                                                        <div className="relative flex-1">
                                                            <Input
                                                                id="jellyfin-token"
                                                                type={showToken ? "text" : "password"}
                                                                value={jellyfinToken.token}
                                                                readOnly
                                                                className="font-mono pr-10"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                                                onClick={() => setShowToken(!showToken)}
                                                            >
                                                                {showToken ? (
                                                                    <EyeOff className="h-4 w-4" />
                                                                ) : (
                                                                    <Eye className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => copyToClipboard(jellyfinToken.token)}
                                                        >
                                                            {copied ? (
                                                                <Check className="h-4 w-4" />
                                                            ) : (
                                                                <Copy className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Use this as your password when logging into Jellyfin
                                                    </p>
                                                </div>
                                            ) : (
                                                <Alert variant="destructive">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertTitle>No Jellyfin Token Found</AlertTitle>
                                                    <AlertDescription>
                                                        Your Jellyfin account hasn't been set up yet. Please contact support.
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" asChild>
                                        <Link href="/dashboard">Back to Dashboard</Link>
                                    </Button>
                                    <Button asChild>
                                        <a
                                            href="http://127.0.0.1:8096"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2"
                                        >
                                            Go to Jellyfin
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Access Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Access Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Library Access</span>
                                        <Badge>Courses Only</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Status</span>
                                        <Badge variant={jellyfinToken ? "default" : "destructive"}>
                                            {jellyfinToken ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Jellyfin URL</span>
                                        <code className="text-sm bg-muted px-2 py-1 rounded">127.0.0.1:8096</code>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Instructions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">How to Use</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs font-bold">1</span>
                                        </div>
                                        <p className="text-sm">Go to <strong>http://127.0.0.1:8096</strong></p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs font-bold">2</span>
                                        </div>
                                        <p className="text-sm">Login with your email and token</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs font-bold">3</span>
                                        </div>
                                        <p className="text-sm">Access the "Courses" library</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs font-bold">4</span>
                                        </div>
                                        <p className="text-sm">Start watching courses</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Security Alert */}
                            <Alert variant="destructive">
                                <Shield className="h-4 w-4" />
                                <AlertTitle>Security Notice</AlertTitle>
                                <AlertDescription>
                                    Your Jellyfin token is confidential. Never share it with anyone.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}