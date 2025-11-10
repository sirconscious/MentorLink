import { Head, Link, router } from '@inertiajs/react'; // Add router import
import DashboardLayout from "../Layouts/DashboardLayout";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, ThumbsUp, ThumbsDown, Eye, Calendar, Plus } from 'lucide-react';
import { useState } from 'react';

export default function Index({ posts }) {
    const [localPosts, setLocalPosts] = useState(posts);
    console.log(posts)
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'À l\'instant';
        if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
        if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
        if (diffInSeconds < 2592000) return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;
        return formatDate(dateString);
    };

    const calculateVotePercentage = (upVotes, downVotes) => {
        const total = upVotes + downVotes;
        if (total === 0) return 50;
        return Math.round((upVotes / total) * 100);
    };

    const truncateContent = (content, maxLength = 150) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    const handleVote = (postId, type) => {
        router.post(`/posts/${postId}/${type}`, {}, {
            preserveScroll: true,
            onSuccess: (page) => {
                // Update local state with the fresh data from server
                if (page.props.posts) {
                    setLocalPosts(page.props.posts);
                }
            }
        });
    };

    return (
        <>
            <Head title="Posts de la communauté" />
            <DashboardLayout>
                <div className="min-h-screen bg-background">
                    {/* Header */}
                    <div className="border-b border-border bg-card">
                        <div className="max-w-6xl mx-auto px-6 py-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-foreground">
                                        Posts de la communauté
                                    </h1>
                                    <p className="text-muted-foreground mt-2">
                                        Découvrez les dernières publications et partagez vos connaissances
                                    </p>
                                </div>
                                <Link href="/posts/create">
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Nouveau post
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Posts List */}
                    <div className="max-w-6xl mx-auto px-6 py-8">
                        {localPosts.length === 0 ? (
                            <Card className="text-center py-12">
                                <CardContent>
                                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        Aucun post pour le moment
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        Soyez le premier à partager vos connaissances avec la communauté !
                                    </p>
                                    <Link href="/posts/create">
                                        <Button>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Créer le premier post
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-6">
                                {localPosts.map((post) => (
                                    <Card key={post.id} className="hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <Link href={`/posts/${post.id}`}>
                                                        <CardTitle className="text-lg hover:text-primary transition-colors cursor-pointer line-clamp-2">
                                                            {post.title}
                                                        </CardTitle>
                                                    </Link>
                                                    <CardDescription className="mt-2 line-clamp-2">
                                                        {truncateContent(post.content)}
                                                    </CardDescription>
                                                </div>
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-4 whitespace-nowrap"
                                                >
                                                    {calculateVotePercentage(post.up_votes, post.down_votes)}% positif
                                                </Badge>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="pb-3">
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                                            {post.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span>{post.user?.name || 'Utilisateur'}</span>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{formatTimeAgo(post.created_at)}</span>
                                                </div>
                                            </div>
                                        </CardContent>

                                        <CardFooter className="flex items-center justify-between pt-3 border-t">
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-2 h-8"
                                                        onClick={() => handleVote(post.id, 'upvote')}
                                                    >
                                                        <ThumbsUp className="w-4 h-4" />
                                                        <span>{post.up_votes}</span>
                                                    </Button>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-2 h-8"
                                                        onClick={() => handleVote(post.id, 'downvote')}
                                                    >
                                                        <ThumbsDown className="w-4 h-4" />
                                                        <span>{post.down_votes}</span>
                                                    </Button>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MessageSquare className="w-4 h-4" />
                                                    <span>{post.comments_count ?? 0} commentaires</span>
                                                </div>
                                            </div>

                                            <Link href={`/posts/${post.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    Voir plus
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}