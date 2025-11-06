<?php

use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get("/subjects" , function(Request $request){
    $subjects = Subject::all();
    return response()->json($subjects);
});