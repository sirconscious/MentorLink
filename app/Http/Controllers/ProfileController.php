<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\JelliFinToken;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $jellyfinToken = JelliFinToken::where('user_id', $user->id)->first();

        return Inertia::render('Profile/Index', [
            // 'auth' => [
            //     'user' => $user ,
            //     'roles' => auth()->check() ? auth()->user()->roles->pluck('name')->toArray() : [],
            // ],
            'jellyfinToken' => $jellyfinToken
        ]);
    }
}
