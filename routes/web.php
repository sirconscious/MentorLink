<?php

use Illuminate\Support\Facades\Broadcast;
use App\Events\ChangeProgressValue;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\authController as ControllersAuthController;
use App\Http\Controllers\CommentsController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CoursesUserController;
use App\Http\Controllers\MentorController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DemandeController;
use App\Http\Controllers\JellyController;
use App\Http\Controllers\JellyFinController;
use App\Http\Controllers\PostsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\StatsController;
use App\Models\Message;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;
Route::get('/', function () {
    return inertia('home');
});

// Route::get("/signup", function () {
//     return inertia('auth/signup');
// });

Route::get("/login", function () {
    return inertia('auth/login');
})->name("login");

// Route::get("/dashboard", function () {
//     return inertia('dashboard');
// })->middleware(['auth'])->name('dashboard');

//google oauth
Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle'])->name('google.redirect');
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback'])->name('google.callback');
//github oauth
Route::get('/auth/github/redirect', [AuthController::class, 'redirectToGithub'])->name('github.redirect');
Route::get('/auth/github/callback', [AuthController::class, 'handleGithubCallback'])->name('github.callback');
Route::post("/logout" , [ControllersAuthController::class , "logout"])->name("logout"); ;
//facebook oauth 
Route::get('/auth/facebook/redirect', [AuthController::class, 'redirectToFacebook']);
Route::get('/auth/facebook/callback', [AuthController::class, 'handleFacebookCallback']);


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
})->middleware(["auth"]);
Route::post('/ratings', [RatingController::class, 'store'])->name('ratings.store');
Route::get('/chat/{subject}', function (Request $request, Subject $subject) {
    $subjects = Subject::all();

    $subject_with_messages = Subject::with(['messages.user'])->find($subject->id);

    return inertia('Chat', [
        "subject" => $subject_with_messages,
        "subjects" => $subjects,
        "subject_messages" => $subject_with_messages->messages
    ]);
});
Route::get("/message/{subject}", function (Request $request , Subject $subject){
    $subject_with_messages = Subject::with(['messages.user'])->find($subject->id);
    return response()->json([
        "messages"=>$subject_with_messages
    ]);
});
Route::post("/message/{subject}", function (Request $request, Subject $subject) {
    $user = auth()->user();

    if (!$user) {
        return response()->json(['error' => 'Utilisateur non authentifié'], 401);
    }

    $message = Message::create([
        'content' => $request->content,
        'user_id' => $user->id,
        'subject_id' => $subject->id
    ]);
    Broadcast::event(new ChangeProgressValue($request->content, $subject->id)); // Use ::event()
    
    return back();
})->middleware("auth"); 


//posts routes 
Route::middleware(["auth"])->prefix("/posts")->group(function(){
    Route::get('/create', [PostsController::class, 'create'])->name('posts.create');
    Route::post('/', [PostsController::class, 'store'])->name('posts.store');
    Route::get('/', [PostsController::class, 'index'])->name('posts.index');
    Route::get('/{post}', [PostsController::class, 'show'])->name('posts.show'); // Add this line

    Route::post('/{post}/upvote', [PostsController::class, 'upvote'])->name('posts.upvote');
    Route::post('/{post}/downvote', [PostsController::class, 'downvote'])->name('posts.downvote');
    Route::post('/{post}/remove-vote', [PostsController::class, 'removeVote'])->name('posts.remove-vote');
}); 
Route::middleware(["auth" , "roles:mentor|"])->prefix("/comment")->group(function(){
    Route::post("/{post}" , [CommentsController::class , "store"])->name("comment.store");
    Route::delete('/{comment}', [CommentsController::class, 'destroy'])->name('comments.destroy');
}); 



Route::get("/calendar", [DemandeController::class, 'calendar'])->name('calendar')->middleware(["auth"]); 


Route::get("/dashboard", [StatsController::class , "mentorStats"])->middleware('auth')->name("dashboard"); 



Route::get("/ctf" , function(){
        return inertia("Ctf") ;
})->middleware("auth") ;


// Route::middleware('auth')->group(function () {
    Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
    Route::get('/courses/view/{filename}', [CourseController::class, 'show'])->name('courses.show');
    Route::get('/courses/proxy/{filename}', [CourseController::class, 'proxy'])->name('courses.proxy');
    Route::get('/courses/download/{filename}', [CourseController::class, 'download'])->name('courses.download');
//});

Route::get('/test-shared-folder', function () {
    $nextcloud = app(\App\Services\NextcloudService::class);
    $files = $nextcloud->listFiles();
    return response()->json($files);
});


// Route::get('/jellyfin', [JellyfinController::class, 'index'])->name('jellyfin.index');
// Route::get('/jellyfin/{courseId}', [JellyfinController::class, 'show'])->name('jellyfin.show');
// Route::get('/jellyfin-debug', [JellyfinController::class, 'debug'])->name('jellyfin.debug');
// Route::get('/jellyfin/video/{videoId}', [JellyfinController::class, 'proxyVideo']); 
Route::get('/create-jellyfin-user', [JellyController::class, 'createUser']);

Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
});