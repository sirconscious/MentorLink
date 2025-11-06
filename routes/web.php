<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;

Route::get('/', function () {
    return inertia('home');
});

Route::get("/signup", function () {
    return inertia('auth/signup');
});

Route::get("/login", function () {
    return inertia('auth/login');
})->name("login");

Route::get("/dashboard", function () {
    return inertia('dashboard');
})->middleware(['auth', 'roles:mentor|'])->name('dashboard');

Route::get("/auth/google/callback", function (Request $request) {
    $user = Socialite::driver('google')->stateless()->user();
    dd($user);
});

Route::get("/auth/google/redirect", function () {
    return Socialite::driver('google')->stateless()->redirect();
}); 

Route::get("/auth/github/redirect", function () {
    return Socialite::driver('github')->stateless()->redirect();
});
Route::get("/auth/github/callback", function (Request $request) {
    $githubUser = Socialite::driver('github')->stateless()->user();
    // Get detailed user info
    $response = Http::withToken($githubUser->token)
        ->get('https://api.github.com/user');
    $detailedInfo = $response->json();
    // Get user's repositories
    $reposResponse = Http::withToken($githubUser->token)
        ->get('https://api.github.com/user/repos', [
            'per_page' => 100,
            'type' => 'owner'
        ]);
    $repos = $reposResponse->json();
   
    $totalCommits = 0;


    // dd([
    //     'created_at' => $detailedInfo['created_at'],
    //     'public_repos' => $detailedInfo['public_repos'],
    //     'followers' => $detailedInfo['followers'],
    //     'following' => $detailedInfo['following'],
    //     'repos' => $repos , 
    // ]); 
    $account_periode = \Carbon\Carbon::parse($detailedInfo['created_at'])->diffInDays(now());
    // dd([
    //     'total_repos' => $detailedInfo['public_repos'],
    //     'account_periode_days' => $account_periode,
    // ]);  
    $user = User::updateOrCreate(
        ['email' => $githubUser->email], // Find by email
        [
            'name' => $githubUser->name ?? $githubUser->nickname,
            'email' => $githubUser->email,
            'password' => bcrypt(\Str::random(16)), // Random password
        ]
    ); 
    $user->roles()->detach(); // Remove existing roles
    if ($account_periode > 365 && $detailedInfo['public_repos'] >= 8) {
        $user->roles()->attach(2); // Attach 'Contributor' role
    }else{ 
        $user->roles()->attach(3); // Attach 'User' role
    } 
    auth()->login($user);
    return redirect()->route("dashboard");
});