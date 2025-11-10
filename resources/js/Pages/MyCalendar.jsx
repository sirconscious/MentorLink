import React, { useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import DashboardLayout from './Layouts/DashboardLayout';

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

export default function MyCalendar({ demandes = [] }) {
    console.log('Demandes prop:', demandes); // Debug log

    // Transform demandes into calendar events
    const events = useMemo(() => {
        console.log('Transforming demandes to events:', demandes); // Debug log

        return demandes.map(demande => {
            // Ensure date_debut is properly formatted
            const startDate = new Date(demande.date_debut);

            return {
                id: `demande-${demande.id}`,
                title: `${demande.subject} (${demande.type}) - ${demande.status}`,
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
                }
            };
        });
    }, [demandes]);

    // Handle date/time slot click - Create new demande
    const handleDateClick = (info) => {
        const subject = prompt('Enter demande subject:');
        if (subject) {
            const description = prompt('Enter demande description (min 20 characters):');
            if (description && description.length < 20) {
                alert('Description must be at least 20 characters long');
                return;
            }

            const type = confirm('Select demande type: OK for Online, Cancel for Presentiel') ? 'online' : 'presentiel';

            // Get mentor_id - you'll need to add a way to select this
            const mentorId = prompt('Enter mentor ID:');
            if (!mentorId) {
                alert('Mentor ID is required');
                return;
            }

            router.post('/demandes', {
                subject: subject,
                description: description,
                date_debut: info.dateStr,
                type: type,
                status: 'pending',
                mentor_id: mentorId
            }, {
                onSuccess: () => {
                    router.reload();
                },
                onError: (errors) => {
                    alert('Error creating demande: ' + JSON.stringify(errors));
                }
            });
        }
    };

    // Handle event click - Show demande details
    const handleEventClick = (info) => {
        const event = info.event;
        const extendedProps = event.extendedProps;

        const action = confirm(
            `Demande Details:\n\n` +
            `Subject: ${extendedProps.subject}\n` +
            `Type: ${extendedProps.demandeType}\n` +
            `Status: ${extendedProps.status}\n` +
            `Description: ${extendedProps.description}\n` +
            `User: ${extendedProps.user}\n` +
            `Mentor: ${extendedProps.mentor}\n\n` +
            `Click OK to delete this demande, Cancel to close.`
        );

        if (action) {
            router.delete(`/demandes/${extendedProps.demandeId}`, {
                onSuccess: () => {
                    router.reload();
                },
                onError: (errors) => {
                    alert('Error deleting demande: ' + JSON.stringify(errors));
                }
            });
        }
    };

    // Handle drag and drop - Update demande date
    const handleEventDrop = (info) => {
        const event = info.event;
        const extendedProps = event.extendedProps;

        router.put(`/demandes/${extendedProps.demandeId}`, {
            date_debut: event.startStr,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Demande date updated successfully');
            },
            onError: (errors) => {
                info.revert();
                alert('Error updating demande date');
            }
        });
    };

    // Handle resize - Update demande duration if needed
    const handleEventResize = (info) => {
        const event = info.event;
        const extendedProps = event.extendedProps;

        router.put(`/demandes/${extendedProps.demandeId}`, {
            date_debut: event.startStr,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Demande updated successfully');
            },
            onError: (errors) => {
                info.revert();
                alert('Error updating demande');
            }
        });
    };

    return (
        <DashboardLayout>
            <Head title="Demandes Calendar" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Demandes Calendar
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Click on any date to create a new demande. Click events to view details.
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

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                            }}
                            events={events}
                            editable={true}
                            selectable={true}
                            selectMirror={true}
                            dayMaxEvents={true}
                            weekends={true}
                            dateClick={handleDateClick}
                            eventClick={handleEventClick}
                            eventDrop={handleEventDrop}
                            eventResize={handleEventResize}
                            height="auto"
                            contentHeight="600px"
                            nowIndicator={true}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}