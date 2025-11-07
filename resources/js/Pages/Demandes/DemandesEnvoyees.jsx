import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '../Layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, ArrowLeft, Trash2, MoreHorizontal, Star } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DemandesEnvoyees({ demandes }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'En attente';
            case 'accepted': return 'Acceptée';
            case 'rejected': return 'Refusée';
            default: return status;
        }
    };

    const deleteDemande = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
            router.delete(`/demandes/${id}`);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleRating = (mentorId) => {
        router.get(`/rate/${mentorId}`);
    };

    return (
        <>
            <Head title="Mes demandes envoyées" />
            <DashboardLayout>
                <div className="min-h-screen bg-background">
                    {/* Header */}
                    <div className="border-b border-border bg-card">
                        <div className="max-w-6xl mx-auto px-6 py-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Link
                                        href="/dashboard"
                                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2 transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Retour au tableau de bord
                                    </Link>
                                    <h1 className="text-2xl font-bold text-foreground">
                                        Mes demandes envoyées
                                    </h1>
                                </div>
                                <Link
                                    href="/mentors"
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Trouver un mentor
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="max-w-6xl mx-auto px-6 py-8">
                        {demandes.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                                <p className="text-muted-foreground mb-4">Aucune demande envoyée pour le moment.</p>
                                <Link
                                    href="/mentors"
                                    className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Trouver un mentor
                                </Link>
                            </div>
                        ) : (
                            <div className="bg-card rounded-lg border border-border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Sujet</TableHead>
                                            <TableHead>Mentor</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Heure</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Statut</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {demandes.map((demande) => (
                                            <TableRow key={demande.id}>
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <div className="font-semibold">{demande.subject}</div>
                                                        <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                            {demande.description}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-muted-foreground" />
                                                        {demande.mentor.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                                        {formatDate(demande.date_debut)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                                        {formatTime(demande.date_debut)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="capitalize">
                                                        {demande.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(demande.status)}>
                                                        {getStatusText(demande.status)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            {demande.status === 'accepted' && (
                                                                <DropdownMenuItem
                                                                    onClick={() => handleRating(demande.mentor.id)}
                                                                    className="text-yellow-600"
                                                                >
                                                                    <Star className="w-4 h-4 mr-2" />
                                                                    Noter le mentor
                                                                </DropdownMenuItem>
                                                            )}
                                                            {demande.status === 'pending' && (
                                                                <DropdownMenuItem
                                                                    onClick={() => deleteDemande(demande.id)}
                                                                    className="text-red-600"
                                                                >
                                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                                    Supprimer
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}