<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostsController extends Controller
{
    public function index()
    {
        $posts = Post::with('user',)
            ->orderBy('created_at', 'desc')
            ->get()->loadCount('comments');;
        return inertia('Posts/Index', [
            'posts' => $posts
        ]);
    }
    public function create()
    {
        return inertia('Posts/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|min:10',
        ]);

        Post::create([
            'title' => $request->title,
            'content' => $request->content,
            'user_id' => Auth::id(),
            'up_votes' => 0,
            'down_votes' => 0,
        ]);

        return redirect()->route('posts.index')
            ->with('success', 'Post créé avec succès!');
    }

    public function show(Post $post)
    {
        $post->load('user',"comments.user");
        return inertia('Posts/Show', [
            'post' => $post
        ]);
    }
    public function upvote(Post $post)
    {
        $user = Auth::user();
        $voteKey = 'post_vote_' . $post->id;

        // Check user's previous vote from session
        $previousVote = session($voteKey);

        if ($previousVote === 'upvote') {
            // Remove upvote
            $post->decrement('up_votes');
            session([$voteKey => null]);
        } elseif ($previousVote === 'downvote') {
            // Change from downvote to upvote
            $post->decrement('down_votes');
            $post->increment('up_votes');
            session([$voteKey => 'upvote']);
        } else {
            // New upvote
            $post->increment('up_votes');
            session([$voteKey => 'upvote']);
        }

        // Return to the posts index with updated data
        return redirect()->back();
    }

    public function downvote(Post $post)
    {
        $user = Auth::user();
        $voteKey = 'post_vote_' . $post->id;

        // Check user's previous vote from session
        $previousVote = session($voteKey);

        if ($previousVote === 'downvote') {
            // Remove downvote
            $post->decrement('down_votes');
            session([$voteKey => null]);
        } elseif ($previousVote === 'upvote') {
            // Change from upvote to downvote
            $post->decrement('up_votes');
            $post->increment('down_votes');
            session([$voteKey => 'downvote']);
        } else {
            // New downvote
            $post->increment('down_votes');
            session([$voteKey => 'downvote']);
        }

        // Return to the posts index with updated data
        return redirect()->back();
    }
}
