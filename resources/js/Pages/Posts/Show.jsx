import { Head, Link } from '@inertiajs/react';
import DashboardLayout from "../Layouts/DashboardLayout";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, ThumbsUp, ThumbsDown, Eye, Calendar, ArrowLeft, Share } from 'lucide-react';
import { router } from '@inertiajs/react';
export default function Show({ post }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateVotePercentage = (upVotes, downVotes) => {
        const total = upVotes + downVotes;
        if (total === 0) return 50;
        return Math.round((upVotes / total) * 100);
    };
    const handleVote = (postId, type) => {
        router.post(`/posts/${postId}/${type}`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                // The page will reload with updated vote counts
            }
        });
    };
    return (
        <>
            <Head title={post.title} />
            <DashboardLayout>
                <div className="min-h-screen bg-background">
                    {/* Header */}
                    <div className="border-b border-border bg-card">
                        <div className="max-w-4xl mx-auto px-6 py-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Link href="/posts">
                                        <Button variant="ghost" size="sm" className="gap-2">
                                            <ArrowLeft className="w-4 h-4" />
                                            Retour aux posts
                                        </Button>
                                    </Link>
                                    <Badge variant="secondary">
                                        {calculateVotePercentage(post.up_votes, post.down_votes)}% positif
                                    </Badge>
                                </div>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Share className="w-4 h-4" />
                                    Partager
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Post Content */}
                    <div className="max-w-4xl mx-auto px-6 py-8">
                        <Card>
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-2xl mb-2">
                                            {post.title}
                                        </CardTitle>
                                        <CardDescription className="text-base">
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="bg-primary/10 text-primary">
                                                            {post.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <span className="font-medium text-foreground">
                                                            {post.user?.name || 'Utilisateur'}
                                                        </span>
                                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                            <Calendar className="w-3 h-3" />
                                                            <span>{formatDate(post.created_at)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pb-6">
                                <ScrollArea className="h-auto max-h-none">
                                    <div className="prose prose-lg max-w-none">
                                        <div className="whitespace-pre-wrap leading-relaxed text-foreground">
                                            {post.content}
                                        </div>
                                    </div>
                                </ScrollArea>
                            </CardContent>

                            <CardFooter className="flex items-center justify-between pt-6 border-t">
                                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => handleVote(post.id, 'upvote')}
                                        >
                                            <ThumbsUp className="w-4 h-4" />
                                            <span>{post.up_votes}</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => handleVote(post.id, 'downvote')}
                                        >
                                            <ThumbsDown className="w-4 h-4" />
                                            <span>{post.down_votes}</span>
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageSquare className="w-4 h-4" />
                                        <span>0 commentaires</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm">
                                        <Share className="w-4 h-4 mr-1" />
                                        Partager
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>

                        {/* Comments Section - Placeholder for now */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Commentaires</CardTitle>
                                <CardDescription>
                                    Soyez le premier à commenter ce post
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>Aucun commentaire pour le moment</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}