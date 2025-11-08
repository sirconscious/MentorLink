<?php

use App\Models\Message;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Mockery\Matcher\Subset;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get("/subjects" , function(Request $request){
    $subjects = Subject::all();
    return response()->json($subjects);
});

