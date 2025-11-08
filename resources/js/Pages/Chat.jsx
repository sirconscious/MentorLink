import { useState, useEffect, useRef } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import DashboardLayout from './Layouts/DashboardLayout';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import axios from 'axios';

export default function Chat({ subject, subjects, subject_message }) {
    const { auth } = usePage().props;
    const currentUserId = auth.user.id;
    const [messages, setMessages] = useState(subject.messages || []);
    const { id, name, description } = subject;
    const [progressValue, setProgressValue] = useState(0);
    const [showSidebar, setShowSidebar] = useState(true);
    const messagesEndRef = useRef(null);
    const scrollAreaRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        content: ''
    });

    // Scroll to bottom function
    const scrollToBottom = () => {
        setTimeout(() => {
            if (scrollAreaRef.current) {
                const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
                if (scrollContainer) {
                    scrollContainer.scrollTop = scrollContainer.scrollHeight;
                }
            }
        }, 100);
    };

    // Scroll to bottom on messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Scroll to bottom on initial load
    useEffect(() => {
        scrollToBottom();
    }, []);

    useEffect(() => {
        // Listen to the progress channel
        const channel = window.Echo.channel(`progress.${id}`);

        channel.listen('ChangeProgressValue', (e) => {
            console.log('Received progress:', e.value);

            // Fetch using axios and console.log the data
            axios.get(`http://localhost:8000/message/${subject.id}`)
                .then(response => {
                    console.log('Axios response data:', response.data);
                    if (response.data.messages && response.data.messages.messages) {
                        setMessages(response.data.messages.messages);
                    } else {
                        console.warn('Format de données inattendu:', response.data);
                        setMessages([]);
                    }
                })
                .catch(error => {
                    console.error('Axios error:', error);
                });
        });

        // Cleanup on unmount
        return () => {
            window.Echo.leaveChannel('progress');
        };
    }, []);

    const handleChat = (id) => {
        router.get(`/chat/${id}`);
    }

    const handleSendMessage = (e) => {
        e.preventDefault();
        post(`/message/${id}`, {
            onSuccess: () => {
                reset('content');
                // Scroll to bottom after sending message
                scrollToBottom();
            }
        });
    }

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    const isCurrentUserMessage = (message) => {
        return message.user_id === currentUserId;
    }

    return (
        <>
            <Head title={`${subject.name} groupe Chat`} />
            <DashboardLayout>
                <div className="container mx-auto p-6 space-y-6">
                    {/* Mobile Toggle Button */}
                    <div className="lg:hidden">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="flex items-center gap-2"
                        >
                            <Menu className="w-4 h-4" />
                            {showSidebar ? 'Masquer les sujets' : 'Afficher les sujets'}
                        </Button>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Subjects Sidebar - Conditionally rendered */}
                        {(showSidebar || window.innerWidth >= 1024) && (
                            <Card className="lg:col-span-1">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5" />
                                        Groupes de discussion
                                    </CardTitle>
                                    {/* <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowSidebar(false)}
                                        className="hidden lg:flex"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button> */}
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-96"> {/* Added ScrollArea here */}
                                        <div className="space-y-2 pr-4">
                                            {subjects.map((subj, index) => (
                                                <Button
                                                    key={index}
                                                    variant={subj.id === subject.id ? "default" : "outline"}
                                                    className="w-full justify-start"
                                                    onClick={() => handleChat(subj.id)}
                                                >
                                                    {subj.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        )}

                        {/* Chat Area */}
                        <Card className={`${showSidebar && window.innerWidth >= 1024 ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    {!showSidebar && window.innerWidth >= 1024 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowSidebar(true)}
                                            className="mr-2"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    )}
                                    {name}
                                    <Badge variant="secondary">
                                        {messages.length} messages
                                    </Badge>
                                </CardTitle>
                                <div className="text-sm text-muted-foreground">
                                    {messages.length > 0 && `Dernier message: ${formatTime(messages[messages.length - 1].created_at)}`}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ScrollArea
                                    className="h-96 border rounded-lg p-4"
                                    ref={scrollAreaRef}
                                >
                                    <div className="space-y-4">
                                        {messages.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                <p>Aucun message pour le moment.</p>
                                                <p className="text-sm">Soyez le premier à envoyer un message !</p>
                                            </div>
                                        ) : (
                                            messages.map((message) => {
                                                const isCurrentUser = isCurrentUserMessage(message);

                                                return (
                                                    <div
                                                        key={message.id}
                                                        className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                                                    >
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback className={`text-xs ${isCurrentUser
                                                                ? 'bg-primary text-primary-foreground'
                                                                : 'bg-primary/10 text-primary'
                                                                }`}>
                                                                {message.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className={`flex-1 ${isCurrentUser ? 'text-right' : ''}`}>
                                                            <div className={`flex items-center gap-2 mb-1 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                                                                <span className="font-medium text-sm">
                                                                    {message.user?.name || 'Utilisateur'}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {formatTime(message.created_at)}
                                                                </span>
                                                            </div>
                                                            <div className={`rounded-lg px-3 py-2 ${isCurrentUser
                                                                ? 'bg-primary text-primary-foreground'
                                                                : 'bg-muted/50'
                                                                }`}>
                                                                <p className="text-sm">{message.content}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </ScrollArea>

                                <form onSubmit={handleSendMessage} className="space-y-2">
                                    <Textarea
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        placeholder="Tapez votre message..."
                                        className="min-h-20"
                                        disabled={processing}
                                    />
                                    {errors.content && (
                                        <p className="text-sm text-red-500">{errors.content}</p>
                                    )}
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing || !data.content.trim()}
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        {processing ? 'Envoi...' : 'Envoyer'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}