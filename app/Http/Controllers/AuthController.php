<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

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

        // Ensure user has role 3 without duplicates
        // $user->roles()->syncWithoutDetaching([3]);

        Auth::login($user);

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

        // Ensure user has role 3 without duplicates
        // $user->roles()->syncWithoutDetaching([3]);

        Auth::login($user);

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

        // See what Facebook actually returns
        \Log::info('Facebook User Data:', [
            'id' => $facebookUser->id,
            'name' => $facebookUser->name,
            'email' => $facebookUser->email,
            'avatar' => $facebookUser->avatar,
        ]);

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

        return redirect()->route('dashboard');
    }
}
