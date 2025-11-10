<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentsController extends Controller
{
    public function store(Request $request , Post $post){

        $request->validate([
            'body' => 'required|string|min:1|max:1000',
        ]);

        $comment = Comment::create([
            'body' => $request->body,
            'user_id' => Auth::id(),
            'post_id' => $post->id,
        ]);

        $comment->load('user');

        return redirect()->back()->with('success', 'Commentaire ajouté avec succès!');
    }
    public function destroy(Comment $comment)
    {
        // Check if user owns the comment
        if ($comment->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $comment->delete();

        return redirect()->back()->with('success', 'Commentaire supprimé avec succès!');
    }
}
