<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MentorController extends Controller
{
    public function index(Request $request)
    {
        $query = User::whereHas('roles', function ($q) {
            $q->where('name', 'mentor');
        })
            ->whereHas('info') // Only mentors who completed their info
            ->with(['info.subjects']);

        // Filter by subject if provided
        if ($request->has('subject') && $request->subject) {
            $query->whereHas('info.subjects', function ($q) use ($request) {
                $q->where('subjects.id', $request->subject);
            });
        }

        // Filter by level if provided
        if ($request->has('niveau') && $request->niveau) {
            $query->whereHas('info', function ($q) use ($request) {
                $q->where('niveau_etude', $request->niveau);
            });
        }

        // Get mentors with their stats
        $mentors = $query->get()->map(function ($mentor) {
            return [
                'id' => $mentor->id,
                'name' => $mentor->name,
                'email' => $mentor->email,
                'niveau_etude' => $mentor->info->niveau_etude,
                'bio' => $mentor->info->bio,
                'subjects' => $mentor->info->subjects,
                // Placeholder stats - you'll implement these later with sessions
                'average_rating' => 0,
                'total_sessions' => 0,
                'points' => 0,
            ];
        });

        // Get all subjects for the filter dropdown
        $subjects = Subject::all();

        return inertia('Mentors/Index', [
            'mentors' => $mentors,
            'subjects' => $subjects,
            'filters' => [
                'subject' => $request->subject,
                'niveau' => $request->niveau,
            ]
        ]);
    }

    public function show($id)
    {
        $mentor = User::whereHas('roles', function ($q) {
            $q->where('name', 'mentor');
        })
            ->with(['info.subjects'])
            ->findOrFail($id);

        return inertia('Mentors/Show', [
            'mentor' => [
                'id' => $mentor->id,
                'name' => $mentor->name,
                'email' => $mentor->email,
                'niveau_etude' => $mentor->info->niveau_etude,
                'bio' => $mentor->info->bio,
                'subjects' => $mentor->info->subjects,
                // Placeholder stats
                'average_rating' => 0,
                'total_sessions' => 0,
                'points' => 0,
            ]
        ]);
    }
}
