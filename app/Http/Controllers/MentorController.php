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
            ->whereHas('info')
            ->with(['info.subjects', 'demandesRecues' => function ($query) {
                $query->where('status', 'accepted');
            }]);

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

        // Get mentors with their real stats
        $mentors = $query->get()->map(function ($mentor) {
            $total_sessions = $mentor->demandesRecues->count();

            return [
                'id' => $mentor->id,
                'name' => $mentor->name,
                'email' => $mentor->email,
                'niveau_etude' => $mentor->info->niveau_etude ?? '',
                'bio' => $mentor->info->bio ?? '',
                'subjects' => $mentor->info->subjects ?? [],
                'average_rating' => 0,
                'total_sessions' => $total_sessions,
                'points' => $mentor->points ?? 0,
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
            ->with(['info.subjects', 'demandesRecues' => function ($query) {
                $query->where('status', 'accepted');
            }])
            ->findOrFail($id);

        $total_sessions = $mentor->demandesRecues->count();

        return inertia('Mentors/Show', [
            'mentor' => [
                'id' => $mentor->id,
                'name' => $mentor->name,
                'email' => $mentor->email,
                'niveau_etude' => $mentor->info->niveau_etude ?? '',
                'bio' => $mentor->info->bio ?? '',
                'subjects' => $mentor->info->subjects ?? [],
                'average_rating' => 0,
                'total_sessions' => $total_sessions,
                'points' => $mentor->points ?? 0,
            ]
        ]);
    }
}
