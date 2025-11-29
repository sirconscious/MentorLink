import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '../Layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, ArrowLeft, Check, X, MoreHorizontal } from 'lucide-react';
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';

export default function DemandesRecues({ demandes }) {
    const [selectedDemande, setSelectedDemande] = useState(null);
    const [actionType, setActionType] = useState('');
    console.log(demandes);
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

    const updateStatus = (id, status) => {
        router.put(`/demandes/${id}/status`, { status });
    };

    const handleAction = (demande, action) => {
        setSelectedDemande(demande);
        setActionType(action);
    };

    const confirmAction = () => {
        if (selectedDemande && actionType) {
            updateStatus(selectedDemande.id, actionType);
        }
        setSelectedDemande(null);
        setActionType('');
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

    const getActionText = (action) => {
        switch (action) {
            case 'accepted': return 'accepter';
            case 'rejected': return 'refuser';
            default: return action;
        }
    };

    return (
        <>
            <Head title="Demandes reçues" />
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
                                        Demandes reçues
                                    </h1>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {demandes.length} demande(s)
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="max-w-6xl mx-auto px-6 py-8">
                        {demandes.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                                <p className="text-muted-foreground">Aucune demande reçue pour le moment.</p>
                            </div>
                        ) : (
                            <div className="bg-card rounded-lg border border-border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Sujet</TableHead>
                                            <TableHead>Étudiant</TableHead>
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
                                                        {demande.user.name}
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
                                                    {demande.status === 'pending' ? (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <DropdownMenuItem
                                                                            onSelect={(e) => e.preventDefault()}
                                                                            onClick={() => handleAction(demande, 'accepted')}
                                                                            className="text-green-600 cursor-pointer"
                                                                        >
                                                                            <Check className="w-4 h-4 mr-2" />
                                                                            Accepter la demande
                                                                        </DropdownMenuItem>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Confirmer l'acceptation</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                Êtes-vous sûr de vouloir accepter la demande de "{demande.subject}"
                                                                                de {demande.user.name} ? Cette action ne peut pas être annulée.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={confirmAction}
                                                                                className="bg-green-600 hover:bg-green-700"
                                                                            >
                                                                                Oui, accepter
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>

                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <DropdownMenuItem
                                                                            onSelect={(e) => e.preventDefault()}
                                                                            onClick={() => handleAction(demande, 'rejected')}
                                                                            className="text-red-600 cursor-pointer"
                                                                        >
                                                                            <X className="w-4 h-4 mr-2" />
                                                                            Refuser la demande
                                                                        </DropdownMenuItem>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Confirmer le refus</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                Êtes-vous sûr de vouloir refuser la demande de "{demande.subject}"
                                                                                de {demande.user.name} ? Cette action ne peut pas être annulée.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={confirmAction}
                                                                                className="bg-red-600 hover:bg-red-700"
                                                                            >
                                                                                Oui, refuser
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    ) : demande.status === 'accepted' && demande.room ? (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => window.open(`${demande.room.room_url}?accessToken=${demande.room.access_token}`, '_blank')}
                                                            className="bg-blue-600 hover:bg-blue-700"
                                                        >
                                                            Rejoindre
                                                        </Button>
                                                    ) : (
                                                        <div className="text-sm text-muted-foreground text-right">
                                                            Traitée
                                                        </div>
                                                    )}
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