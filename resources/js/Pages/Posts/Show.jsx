import { Head, Link } from '@inertiajs/react';
import DashboardLayout from "../Layouts/DashboardLayout";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, ThumbsUp, ThumbsDown, Eye, Calendar, ArrowLeft, Share, Send, Trash2 } from 'lucide-react';
import { router } from '@inertiajs/react';
import ShareDropdown from '@/components/ui/ShareDropdown';
import { useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ post }) {
    const { data, setData, post: submitComment, processing, errors, reset } = useForm({
        body: ''
    });
    const user = usePage().props.auth.user;
    const [deleteConfirm, setDeleteConfirm] = useState(null);

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

    const handleSubmitComment = (e) => {
        e.preventDefault();
        submitComment(`/comment/${post.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                reset('body');
            }
        });
    };

    const handleDeleteComment = (commentId) => {
        setDeleteConfirm(commentId);
    };

    const confirmDelete = () => {
        if (deleteConfirm) {
            router.delete(`/comment/${deleteConfirm}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteConfirm(null);
                }
            });
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm(null);
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
                                <ShareDropdown />
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
                                            {post.body}
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
                                        <span>{post.comments?.length || 0} commentaires</span>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>

                        {/* Comments Section */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Commentaires</CardTitle>
                                <CardDescription>
                                    {post.comments?.length > 0
                                        ? `${post.comments.length} commentaire${post.comments.length > 1 ? 's' : ''}`
                                        : 'Soyez le premier à commenter ce post'
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Add Comment Form */}
                                <form onSubmit={handleSubmitComment} className="space-y-3">
                                    <div className="space-y-2">
                                        <textarea
                                            value={data.body}
                                            onChange={(e) => setData('body', e.target.value)}
                                            placeholder="Ajouter un commentaire..."
                                            className="w-full min-h-24 p-3 border border-border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            disabled={processing}
                                        />
                                        {errors.body && (
                                            <p className="text-sm text-red-500">{errors.content}</p>
                                        )}
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={processing || !data.body.trim()}
                                        className="flex items-center gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        {processing ? 'Publication...' : 'Publier le commentaire'}
                                    </Button>
                                </form>

                                {/* Comments List */}
                                {post.comments && post.comments.length > 0 ? (
                                    <div className="space-y-4">
                                        {post.comments.map((comment) => (
                                            <div key={comment.id} className="flex gap-3 p-4 border border-border rounded-lg">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                        {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium text-sm">
                                                            {comment.user?.name || 'Utilisateur'}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatDate(comment.created_at)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-foreground">{comment.body}</p>
                                                </div>
                                                {
                                                    user.id == comment.user.id && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )
                                                }
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>Aucun commentaire pour le moment</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Delete Confirmation Popup */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <Card className="w-full max-w-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trash2 className="w-5 h-5 text-red-500" />
                                    Supprimer le commentaire
                                </CardTitle>
                                <CardDescription>
                                    Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-3 justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={cancelDelete}
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={confirmDelete}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Supprimer
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </DashboardLayout>
        </>
    );
}