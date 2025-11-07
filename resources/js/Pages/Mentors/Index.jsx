import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Star, BookOpen, Award, Filter, X, Search, GraduationCap } from 'lucide-react';
import DashboardLayout from '../Layouts/DashboardLayout';

export default function Index({ mentors, subjects, filters }) {
    const [selectedSubject, setSelectedSubject] = useState(filters.subject || '');
    const [selectedNiveau, setSelectedNiveau] = useState(filters.niveau || '');
    const [showFilters, setShowFilters] = useState(false);

    const niveaux = ['CP2', 'CI1', 'CI2', 'CI3'];

    const handleFilter = () => {
        router.get('/mentors', {
            subject: selectedSubject || undefined,
            niveau: selectedNiveau || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
        setShowFilters(false);
    };

    const clearFilters = () => {
        setSelectedSubject('');
        setSelectedNiveau('');
        router.get('/mentors', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const hasActiveFilters = selectedSubject || selectedNiveau;
    console.log(mentors)
    return (
        <>
            <Head title="Trouver un mentor" />
            <DashboardLayout>
                <div className="min-h-screen bg-background">
                    {/* Header */}
                    <div className="bg-card border-b border-border">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-foreground">
                                        Trouver un mentor
                                    </h1>
                                    <p className="mt-2 text-muted-foreground">
                                        {mentors.length} mentor{mentors.length > 1 ? 's' : ''} disponible{mentors.length > 1 ? 's' : ''}
                                    </p>
                                </div>
                                
                                {/* Enhanced Filter Button */}
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-3 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 transform hover:scale-[1.02] shadow-lg border border-primary/20"
                                >
                                    <Filter className="w-5 h-5" />
                                    <span className="font-semibold">Filtres</span>
                                    {hasActiveFilters && (
                                        <span className="px-2 py-1 bg-primary-foreground text-primary text-xs font-bold rounded-full min-w-6">
                                            {(selectedSubject ? 1 : 0) + (selectedNiveau ? 1 : 0)}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Enhanced Filter Panel */}
                        {showFilters && (
                            <div className="mb-8 p-6 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg animate-in slide-in-from-top duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <Search className="w-5 h-5 text-primary" />
                                        <h2 className="text-xl font-bold text-foreground">Filtrer les mentors</h2>
                                    </div>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Enhanced Subject Filter */}
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                            <BookOpen className="w-4 h-4" />
                                            Module
                                        </label>
                                        <select
                                            value={selectedSubject}
                                            onChange={(e) => setSelectedSubject(e.target.value)}
                                            className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                                        >
                                            <option value="" className="text-muted-foreground">Tous les modules</option>
                                            {subjects.map((subject) => (
                                                <option key={subject.id} value={subject.id}>
                                                    {subject.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Enhanced Level Filter */}
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                            <GraduationCap className="w-4 h-4" />
                                            Niveau d'études
                                        </label>
                                        <select
                                            value={selectedNiveau}
                                            onChange={(e) => setSelectedNiveau(e.target.value)}
                                            className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                                        >
                                            <option value="" className="text-muted-foreground">Tous les niveaux</option>
                                            {niveaux.map((niveau) => (
                                                <option key={niveau} value={niveau}>
                                                    {niveau}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6 pt-6 border-t border-border/50">
                                    <button
                                        onClick={handleFilter}
                                        className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 font-semibold shadow-lg"
                                    >
                                        Appliquer les filtres
                                    </button>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="px-6 py-3 bg-muted text-muted-foreground rounded-xl hover:bg-muted/80 transition-all duration-300 font-medium border border-border"
                                        >
                                            Réinitialiser
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Mentors Grid (unchanged) */}
                        {mentors.length === 0 ? (
                            <div className="text-center py-12">
                                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold text-foreground mb-2">
                                    Aucun mentor trouvé
                                </h3>
                                <p className="text-muted-foreground">
                                    Essayez de modifier vos filtres ou revenez plus tard
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {mentors.map((mentor) => (
                                    <div
                                        key={mentor.id}
                                        className="bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                                    >
                                        {/* Mentor Header */}
                                        <div className="p-6 border-b border-border">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-foreground">
                                                        {mentor.name}
                                                    </h3>
                                                    <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                                                        {mentor.niveau_etude}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Rating */}
                                            <div className="flex items-center gap-1 mb-3">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${
                                                            i < Math.floor(mentor.average_rating)
                                                                ? 'fill-accent text-accent'
                                                                : 'text-muted'
                                                        }`}
                                                    />
                                                ))}
                                                <span className="ml-2 text-sm text-muted-foreground">
                                                    ({mentor.total_sessions} sessions)
                                                </span>
                                            </div>

                                            {/* Bio */}
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {mentor.bio || "Aucune présentation disponible"}
                                            </p>
                                        </div>

                                        {/* Subjects */}
                                        <div className="p-6 bg-muted/30">
                                            <div className="flex items-center gap-2 mb-2">
                                                <BookOpen className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm font-medium text-foreground">
                                                    Modules
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {mentor.subjects.map((subject) => (
                                                    <span
                                                        key={subject.id}
                                                        className="px-2 py-1 text-xs bg-background text-foreground rounded border border-border"
                                                    >
                                                        {subject.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Points */}
                                        <div className="p-4 bg-accent/5 border-t border-border flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-accent">
                                                <Award className="w-4 h-4" />
                                                <span className="text-sm font-medium">
                                                    {mentor.points} points
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => router.visit(`/mentors/${mentor.id}`)}
                                                className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:opacity-90 transition-opacity"
                                            >
                                                Demander de l'aide
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}