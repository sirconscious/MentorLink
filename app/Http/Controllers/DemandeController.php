<?php

namespace App\Http\Controllers;

use App\Models\Demande;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DemandeController extends Controller
{
    public function create(User $mentor)
    {
        $mentor->load('info.subjects');

        return inertia('DemandeForm', [
            'mentor' => $mentor,
            'subjects' => $mentor->info?->subjects ?? []
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string|min:20',
            'date_debut' => 'required|date|after:now',
            'type' => ['required', Rule::in(['online', 'presentiel'])],
            'mentor_id' => 'required|exists:users,id'
        ]);

        Demande::create([
            'user_id' => Auth::id(),
            'mentor_id' => $request->mentor_id,
            'subject' => $request->subject,
            'description' => $request->description,
            'date_debut' => $request->date_debut,
            'type' => $request->type,
            'status' => 'pending'
        ]);

        return redirect()->route('mentors.show', $request->mentor_id)
            ->with('success', 'Votre demande de session a été envoyée avec succès!');
    }

    public function demandesEnvoyees()
    {
        $demandes = Auth::user()->demandesEnvoyees()
            ->with('mentor.info')
            ->latest()
            ->get();

        return Inertia::render('Demandes/DemandesEnvoyees', [
            'demandes' => $demandes
        ]);
    }

    public function demandesRecues()
    {
        $demandes = Auth::user()->demandesRecues()
            ->with('user.info')
            ->latest()
            ->get();

        return Inertia::render('Demandes/Recues', [
            'demandes' => $demandes
        ]);
    }

    public function updateStatus(Request $request, Demande $demande)
    {
        // Vérifier que l'utilisateur est le mentor de cette demande
        if ($demande->mentor_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'status' => ['required', Rule::in(['accepted', 'rejected'])]
        ]);

        if ($request->status == "accepted") {
            $demande->mentor->increment('points', 10);
        }

        $demande->update([
            'status' => $request->status
        ]);

        return back()->with('success', 'Statut de la demande mis à jour!');
    }

    public function destroy(Demande $demande)
    {
        // Vérifier que l'utilisateur est l'auteur de la demande
        if ($demande->user_id !== Auth::id()) {
            abort(403);
        }

        $demande->delete();

        return back()->with('success', 'Demande supprimée!');
    }

    // Fixed calendar method
    public function calendar()
    {
        // Get demandes where user is either the student or the mentor
        $demandes = Demande::where('user_id', auth()->id())
            ->orWhere('mentor_id', auth()->id())
            ->with(['user:id,name', 'mentor:id,name'])
            ->get()
            ->map(function ($demande) {
                return [
                    'id' => $demande->id,
                    'subject' => $demande->subject,
                    'description' => $demande->description,
                    'date_debut' => $demande->date_debut->format('Y-m-d\TH:i:s'), // Fixed this line
                    'type' => $demande->type,
                    'status' => $demande->status,
                    'user_id' => $demande->user_id,
                    'mentor_id' => $demande->mentor_id,
                    'user' => $demande->user,
                    'mentor' => $demande->mentor,
                ];
            });

        \Log::info('Calendar demandes count: ' . $demandes->count());
        \Log::info('Calendar demandes data: ' . json_encode($demandes));

        return Inertia::render('MyCalendar', [
            'demandes' => $demandes
        ]);
    }

    // Add update method for calendar drag/drop
    public function update(Request $request, Demande $demande)
    {
        // Check if user is either the student or mentor
        if ($demande->user_id !== Auth::id() && $demande->mentor_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'date_debut' => 'sometimes|date',
            'status' => ['sometimes', Rule::in(['pending', 'accepted', 'rejected'])],
        ]);

        $demande->update($request->only(['date_debut', 'status']));

        return back()->with('success', 'Demande mise à jour!');
    }
}
