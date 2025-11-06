import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Star, BookOpen, Award, Mail, Clock } from 'lucide-react';
import DashboardLayout from '../Layouts/DashboardLayout';
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';

export default function MentorShow({ mentor }) {
    // Simple pie chart data
    const subjectData = mentor.subjects.map((subject, index) => ({
        name: subject.name,
        value: 1,
        color: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][index % 5]
    }));

    return (
        <>
            <Head title={`Mentor - ${mentor.name}`} />
            <DashboardLayout>
                <div className="min-h-screen bg-background">
                    {/* Simplified Header */}
                    <div className="bg-card border-b border-border">
                        <div className="max-w-4xl mx-auto px-6 py-6">
                            <Link
                                href="/mentors"
                                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Retour aux mentors
                            </Link>

                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <span className="text-xl font-bold text-primary">
                                        {mentor.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                
                                <div>
                                    <h1 className="text-2xl font-bold text-foreground">
                                        {mentor.name}
                                    </h1>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-sm text-muted-foreground">
                                            {mentor.niveau_etude}
                                        </span>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Star className="w-4 h-4 text-yellow-500" />
                                            <span>{mentor.average_rating > 0 ? mentor.average_rating.toFixed(1) : 'Nouveau'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto px-6 py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Bio Section */}
                                <div className="bg-card rounded-lg border border-border p-6">
                                    <h2 className="text-xl font-semibold text-foreground mb-4">
                                        À propos
                                    </h2>
                                    <p className="text-muted-foreground">
                                        {mentor.bio || "Ce mentor n'a pas encore ajouté de présentation."}
                                    </p>
                                </div>

                                {/* Subjects Section with Simple Pie Chart */}
                                <div className="bg-card rounded-lg border border-border p-6">
                                    <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5" />
                                        Modules enseignés
                                    </h2>
                                    
                                    <div className="flex flex-col lg:flex-row items-center gap-6">
                                        {/* Simple Pie Chart */}
                                        <div className="h-48 w-48">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={subjectData}
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={60}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                    >
                                                        {subjectData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Subject List */}
                                        <div className="space-y-2">
                                            {mentor.subjects.map((subject, index) => (
                                                <div key={subject.id} className="flex items-center gap-3">
                                                    <div 
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: subjectData[index].color }}
                                                    />
                                                    <span className="text-foreground">{subject.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Contact Card */}
                                <div className="bg-card rounded-lg border border-border p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">
                                        Contacter
                                    </h3>
                                    
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <Mail className="w-4 h-4" />
                                            <span>{mentor.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <Clock className="w-4 h-4" />
                                            <span>Réponse sous 48h</span>
                                        </div>
                                    </div>

                                    <button className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                                        Demander une session
                                    </button>
                                </div>

                                {/* Stats Card */}
                                <div className="bg-card rounded-lg border border-border p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">
                                        Statistiques
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm text-muted-foreground">Sessions</span>
                                            <span className="font-medium">{mentor.total_sessions}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm text-muted-foreground">Note</span>
                                            <span className="font-medium">
                                                {mentor.average_rating > 0 ? `${mentor.average_rating.toFixed(1)}/5` : '—'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm text-muted-foreground">Points</span>
                                            <span className="font-medium">{mentor.points}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}