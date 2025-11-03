<?php

use Illuminate\Support\Facades\Route;

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