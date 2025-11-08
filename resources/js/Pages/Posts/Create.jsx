import { Head, useForm, router } from '@inertiajs/react';
import DashboardLayout from "../Layouts/DashboardLayout";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Send } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/posts');
    };

    return (
        <>
            <Head title="Créer un nouveau post" />
            <DashboardLayout>
                <div className="min-h-screen bg-background">
                    {/* Header */}
                    <div className="border-b border-border bg-card">
                        <div className="max-w-4xl mx-auto px-6 py-6">
                            <button
                                onClick={() => window.history.back()}
                                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Retour
                            </button>
                            <h1 className="text-2xl font-bold text-foreground">
                                Créer un nouveau post
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Partagez vos connaissances avec la communauté
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="max-w-4xl mx-auto px-6 py-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Nouveau post</CardTitle>
                                <CardDescription>
                                    Rédigez votre article. Les posts de qualité seront appréciés par la communauté.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-6">
                                    {/* Title Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-sm font-medium">
                                            Titre *
                                        </Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Donnez un titre accrocheur à votre post..."
                                            className="w-full"
                                            required
                                        />
                                        {errors.title && (
                                            <p className="text-sm text-red-500">{errors.title}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Soyez concis et descriptif
                                        </p>
                                    </div>

                                    {/* Content Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="content" className="text-sm font-medium">
                                            Contenu *
                                        </Label>
                                        <Textarea
                                            id="content"
                                            value={data.content}
                                            onChange={(e) => setData('content', e.target.value)}
                                            placeholder="Rédigez le contenu de votre post... Vous pouvez utiliser le format Markdown."
                                            className="min-h-64 resize-y"
                                            required
                                        />
                                        {errors.content && (
                                            <p className="text-sm text-red-500">{errors.content}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Partagez vos connaissances, posez des questions, ou discutez d'un sujet qui vous passionne
                                        </p>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => window.history.back()}
                                            className="flex-1"
                                        >
                                            Annuler
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-1"
                                            disabled={processing || !data.title.trim() || !data.content.trim()}
                                        >
                                            <Send className="w-4 h-4 mr-2" />
                                            {processing ? 'Publication...' : 'Publier le post'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Tips Card */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="text-sm">Conseils pour un bon post</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm text-muted-foreground space-y-2">
                                    <li>• Soyez clair et précis dans votre titre</li>
                                    <li>• Structurez votre contenu avec des paragraphes</li>
                                    <li>• Utilisez des exemples concrets quand c'est possible</li>
                                    <li>• Vérifiez l'orthographe avant de publier</li>
                                    <li>• Respectez les autres membres de la communauté</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}