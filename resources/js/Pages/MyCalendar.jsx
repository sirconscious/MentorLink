import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import DashboardLayout from './Layouts/DashboardLayout';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Users } from 'lucide-react';

// Helper functions defined outside component
const getStatusColor = (status) => {
    switch (status) {
        case 'pending':
            return '#f59e0b';
        case 'accepted':
            return '#10b981';
        case 'rejected':
            return '#ef4444';
        default:
            return '#6b7280';
    }
};

const getStatusBorderColor = (status) => {
    switch (status) {
        case 'pending':
            return '#d97706';
        case 'accepted':
            return '#059669';
        case 'rejected':
            return '#dc2626';
        default:
            return '#374151';
    }
};

const getStatusBadgeVariant = (status) => {
    switch (status) {
        case 'pending':
            return 'default';
        case 'accepted':
            return 'success';
        case 'rejected':
            return 'destructive';
        default:
            return 'secondary';
    }
};

export default function MyCalendar({ demandes = [] }) {
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Transform demandes into calendar events
    const events = useMemo(() => {
        return demandes.map(demande => {
            const startDate = new Date(demande.date_debut);

            return {
                id: `demande-${demande.id}`,
                title: `${demande.subject} (${demande.type})`,
                start: startDate.toISOString(),
                backgroundColor: getStatusColor(demande.status),
                textColor: '#ffffff',
                borderColor: getStatusBorderColor(demande.status),
                extendedProps: {
                    type: 'demande',
                    demandeId: demande.id,
                    status: demande.status,
                    description: demande.description,
                    user: demande.user?.name || 'Unknown',
                    mentor: demande.mentor?.name || 'Unknown',
                    subject: demande.subject,
                    demandeType: demande.type,
                    dateDebut: demande.date_debut,
                }
            };
        });
    }, [demandes]);

    // Handle event click - Show details dialog
    const handleEventClick = (info) => {
        setSelectedEvent(info.event.extendedProps);
        setDetailsDialogOpen(true);
    };

    return (
        <DashboardLayout>
            <Head title="Demandes Calendar" />

            <div className="min-h-screen  dark:bg-gray-900">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Demandes Calendar
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Click on events to view details.
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Total demandes: {demandes.length}
                        </p>

                        {/* Status Legend */}
                        <div className="flex flex-wrap gap-4 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Accepted</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Rejected</span>
                            </div>
                        </div>
                    </div>

                    <div className=" dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                            }}
                            events={events}
                            editable={false}
                            selectable={false}
                            dayMaxEvents={true}
                            weekends={true}
                            eventClick={handleEventClick}
                            height="auto"
                            contentHeight="600px"
                            nowIndicator={true}
                        />
                    </div>
                </div>
            </div>

            {/* Demande Details Dialog - Read Only */}
            <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span>Demande Details</span>
                            {selectedEvent && (
                                <Badge variant={getStatusBadgeVariant(selectedEvent.status)}>
                                    {selectedEvent.status}
                                </Badge>
                            )}
                        </DialogTitle>
                    </DialogHeader>
                    {selectedEvent && (
                        <div className="grid gap-4 py-4">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</p>
                                    <p className="text-sm text-gray-900 dark:text-white">{selectedEvent.subject}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Date & Time</p>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        {new Date(selectedEvent.dateDebut).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <User className="w-5 h-5 text-gray-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</p>
                                    <p className="text-sm text-gray-900 dark:text-white capitalize">{selectedEvent.demandeType}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Users className="w-5 h-5 text-gray-500 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Participants</p>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        Student: {selectedEvent.user}
                                    </p>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        Mentor: {selectedEvent.mentor}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {selectedEvent.description}
                                </p>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDetailsDialogOpen(false)}
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}