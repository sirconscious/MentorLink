<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\authController as ControllersAuthController;
use App\Http\Controllers\MentorController;
use App\Http\Controllers\UserController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
})->middleware(['auth'])->name('dashboard');

//google oauth
Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle'])->name('google.redirect');
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback'])->name('google.callback');
//github oauth
Route::get('/auth/github/redirect', [AuthController::class, 'redirectToGithub'])->name('github.redirect');
Route::get('/auth/github/callback', [AuthController::class, 'handleGithubCallback'])->name('github.callback');
Route::post("/logout" , [ControllersAuthController::class , "logout"])->name("logout"); ; 

Route::get("/complete-info", function () {
    return inertia('CompleteInfo');
})->middleware(['auth'])->name('complete.info'); 

Route::post("/complete-info" , [UserController::class , "completeInfo"])->name("complete-info");
Route::get('/mentor/{id}', [MentorController::class, 'show']);