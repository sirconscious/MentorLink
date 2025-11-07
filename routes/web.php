<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\authController as ControllersAuthController;
use App\Http\Controllers\MentorController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DemandeController;
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
Route::get('/mentors/{id}', [MentorController::class, 'show'])->name("mentors.show");
Route::get('/mentors', [MentorController::class, 'index'])->name('mentors.index');


Route::middleware(['auth'])->group(function () {
    // Création de demande
    Route::get('/mentors/{mentor}/demande', [DemandeController::class, 'create'])
        ->name('demandes.create');
    Route::post('/demandes', [DemandeController::class, 'store'])
        ->name('demandes.store');

    // Demandes envoyées et reçues
    Route::get('/mes-demandes/envoyees', [DemandeController::class, 'demandesEnvoyees'])
        ->name('demandes.envoyees');
    Route::get('/mes-demandes/recues', [DemandeController::class, 'demandesRecues'])
        ->name('demandes.recues');

    // Gestion des demandes
    Route::put('/demandes/{demande}/status', [DemandeController::class, 'updateStatus'])
        ->name('demandes.updateStatus');
    Route::delete('/demandes/{demande}', [DemandeController::class, 'destroy'])
        ->name('demandes.destroy');
}); 


Route::get("/rate/{id}" , function(Request $request , $id){
    return inertia("Demandes/RateSession", [
        "id" => $id
    ]);
});