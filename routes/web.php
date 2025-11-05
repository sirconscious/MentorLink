<?php

use Illuminate\Http\Request;  
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
});

Route::get("/dashboard", function () {
    return inertia('dashboard');
});
Route::get("/auth/google/callback", function (Request $request) {
    $user = Socialite::driver('google')->stateless()->user();
    dd($user);
});

Route::get("/auth/google/redirect", function () {
    return Socialite::driver('google')->stateless()->redirect();
});