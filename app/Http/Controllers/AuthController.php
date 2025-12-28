<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use App\Http\Controllers\JellyController;
use App\Models\JelliFinToken;

class AuthController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback()
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        $user = User::firstOrCreate(
            ['email' => $googleUser->email],
            [
                'name' => $googleUser->name ?? $googleUser->nickname,
                'email_verified_at' => now(),
                'password' => bcrypt(\Str::random(16)),
            ]
        );

        Auth::login($user);

        // Generate token for Jellyfin
        $token = \Str::random(12);

        // Create Jellyfin user with email + token
        $jellyController = new JellyController();
        $jellyfinPassword = $jellyController->createUser($user->email, $token);

        // Store the token in database
        if ($jellyfinPassword) {
            JelliFinToken::create([
                'user_id' => $user->id,
                'token' => $jellyfinPassword, // This is the password for Jellyfin
            ]);
        }

        return redirect()->route('dashboard');
    }

    public function redirectToGithub()
    {
        return Socialite::driver('github')->stateless()->redirect();
    }

    public function handleGithubCallback()
    {
        $githubUser = Socialite::driver('github')->stateless()->user();

        $user = User::firstOrCreate(
            ['email' => $githubUser->email],
            [
                'name' => $githubUser->name ?? $githubUser->nickname,
                'email_verified_at' => now(),
                'password' => bcrypt(\Str::random(16)),
            ]
        );

        Auth::login($user);

        // Generate token for Jellyfin
        $token = \Str::random(12);

        // Create Jellyfin user with email + token
        $jellyController = new JellyController();
        $jellyfinPassword = $jellyController->createUser($user->email, $token);

        // Store the token in database
        if ($jellyfinPassword) {
            JelliFinToken::create([
                'user_id' => $user->id,
                'token' => $jellyfinPassword,
            ]);
        }

        return redirect()->route('dashboard');
    }

    public function redirectToFacebook()
    {
        return Socialite::driver('facebook')
            ->stateless()
            ->scopes(['email', 'public_profile'])
            ->redirect();
    }

    public function handleFacebookCallback()
    {
        $facebookUser = Socialite::driver('facebook')->stateless()->user();

        $user = User::updateOrCreate(
            ['facebook_id' => $facebookUser->id],
            [
                'name' => $facebookUser->name,
                'email' => $facebookUser->email ?? null,
                'facebook_id' => $facebookUser->id,
                'email_verified_at' => $facebookUser->email ? now() : null,
                'password' => bcrypt(\Str::random(16)),
            ]
        );

        Auth::login($user);

        // Generate token for Jellyfin
        $token = \Str::random(12);

        // Create Jellyfin user with email + token
        $jellyController = new JellyController();
        $jellyfinPassword = $jellyController->createUser($user->email, $token);

        // Store the token in database
        if ($jellyfinPassword) {
            JelliFinToken::create([
                'user_id' => $user->id,
                'token' => $jellyfinPassword,
            ]);
        }

        return redirect()->route('dashboard');
    }
}
