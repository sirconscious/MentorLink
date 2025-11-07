<?php

namespace App\Http\Controllers;

use App\Models\Rate;
use App\Models\Demande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RatingController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'note' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
            'problem_resolved' => 'required|in:oui,partiellement,non',
            'demande_id' => 'required|exists:demandes,id'
        ]);

        // Récupérer la demande pour avoir le mentor_id
        $demande = Demande::findOrFail($request->demande_id);

        // Vérifier que l'utilisateur est bien le mentoré de cette demande
        if ($demande->user_id !== Auth::id()) {
            abort(403, 'Vous ne pouvez pas noter cette session.');
        }

        // Vérifier si l'utilisateur a déjà noté cette session
        $existingRating = Rate::where('user_id', Auth::id())
            ->where('demande_id', $request->demande_id)
            ->first();

        if ($existingRating) {
            return back()->with('error', 'Vous avez déjà noté cette session.');
        }

        // Créer la notation
        Rate::create([
            'user_id' => Auth::id(),
            'mentor_id' => $demande->mentor_id,
            'demande_id' => $request->demande_id,
            'note' => $request->note,
            'comment' => $request->comment,
            'problem_resolved' => $request->problem_resolved,
        ]);

        return redirect()->route('demandes.envoyees')
            ->with('success', 'Merci pour votre feedback !');
    }
}
