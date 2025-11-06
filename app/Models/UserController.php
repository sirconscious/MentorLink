<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Model
{
    public function completeInfo(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            "niveau_etude" => "required|string|max:255",
            "bio" => "required|string|max:500",
            "subjects" => "required|array|min:1",
            "subjects.*" => "integer|exists:subjects,id"
        ]);

        try {
            DB::beginTransaction();

            // Get the authenticated user
            $user = auth()->user();

            // Check if user already has info
            $info = $user->info;

            if ($info) {
                // Update existing info
                $info->update([
                    'niveau_etude' => $validated['niveau_etude'],
                    'bio' => $validated['bio']
                ]);
            } else {
                // Create new info
                $info = Info::create([
                    'user_id' => $user->id,
                    'niveau_etude' => $validated['niveau_etude'],
                    'bio' => $validated['bio']
                ]);
            }

            // Sync subjects (this automatically handles the pivot table)
            $info->subjects()->sync($validated['subjects']);

            DB::commit();

            return redirect()->route("dashboard")->with("success", "Profile completed successfully! Welcome to MentorLink.");        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to save profile. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        } 
    }
}
