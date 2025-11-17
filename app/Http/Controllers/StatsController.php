<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StatsController extends Controller
{
    public function mentorStats(Request $request){
        $user = auth()->user();   
        $user_all_info = $user->load("receivedRatings", "demandesRecues" , "demandesEnvoyees" , "posts" , "info.subjects");
            return inertia("Stats" , [
                "user" => $user_all_info
            ]) ;
        }
    }
