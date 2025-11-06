import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Star, BookOpen, Award, Mail } from 'lucide-react';

export default function MentorShow({ mentor }) {
    return (
        <>
            <Head title={`Mentor - ${mentor.name}`} />
            
            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="bg-card border-b border-border">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <Link
                            href="/mentors"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Retour à la liste
                        </Link>

                        <div className="flex items-start gap-6">
                            {/* Avatar Placeholder */}
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-3xl font-bold text-primary">
                                    {mentor.name.charAt(0).toUpperCase()}
                                </span>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold text-foreground mb-2">
                                            {mentor.name}
                                        </h1>
                                        <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded">
                                            {mentor.niveau_etude}
                                        </span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-6 mt-4">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${
                                                    i < Math.floor(mentor.average_rating)
                                                        ? 'fill-accent text-accent'
                                                        : 'text-muted'
                                                }`}
                                            />
                                        ))}
                                        <span className="ml-2 text-muted-foreground">
                                            {mentor.average_rating > 0 ? mentor.average_rating.toFixed(1) : 'Nouveau'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <BookOpen className="w-5 h-5" />
                                        <span>{mentor.total_sessions} sessions données</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-accent">
                                        <Award className="w-5 h-5" />
                                        <span className="font-medium">{mentor.points} points</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Bio Section */}
                            <div className="bg-card rounded-lg border border-border p-6">
                                <h2 className="text-xl font-semibold text-foreground mb-4">
                                    À propos
                                </h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    {mentor.bio || "Ce mentor n'a pas encore ajouté de présentation."}
                                </p>
                            </div>

                            {/* Subjects Section */}
                            <div className="bg-card rounded-lg border border-border p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                    <h2 className="text-xl font-semibold text-foreground">
                                        Modules enseignés
                                    </h2>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {mentor.subjects.map((subject) => (
                                        <div
                                            key={subject.id}
                                            className="px-4 py-3 bg-muted/30 rounded-lg border border-border"
                                        >
                                            <p className="font-medium text-foreground">
                                                {subject.name}
                                            </p>
                                            {subject.description && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {subject.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Reviews Section (Placeholder) */}
                            <div className="bg-card rounded-lg border border-border p-6">
                                <h2 className="text-xl font-semibold text-foreground mb-4">
                                    Avis des étudiants
                                </h2>
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>Aucun avis pour le moment</p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Request Help Card */}
                            <div className="bg-card rounded-lg border border-border p-6 sticky top-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4">
                                    Demander de l'aide
                                </h3>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="w-4 h-4" />
                                        <span>{mentor.email}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        // This will be implemented when you create the request help functionality
                                        alert('Fonctionnalité de demande à implémenter');
                                    }}
                                    className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                                >
                                    Demander une session
                                </button>

                                <p className="text-xs text-muted-foreground mt-3 text-center">
                                    Le mentor répondra à votre demande sous 48h
                                </p>
                            </div>

                            {/* Stats Card */}
                            <div className="bg-card rounded-lg border border-border p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4">
                                    Statistiques
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Sessions données</span>
                                        <span className="font-medium text-foreground">{mentor.total_sessions}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Note moyenne</span>
                                        <span className="font-medium text-foreground">
                                            {mentor.average_rating > 0 ? `${mentor.average_rating.toFixed(1)}/5` : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Points accumulés</span>
                                        <span className="font-medium text-accent">{mentor.points}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}