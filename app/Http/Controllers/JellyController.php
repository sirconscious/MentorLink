<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JelliFinToken; // Add this

class JellyController extends Controller
{
    public function createUser($userName, $password)
    {
        $apiKey = 'f21b872fe6494c09bd089930d9e2c28c';
        $baseUrl = 'http://127.0.0.1:8096';

        // MANUAL PARAMETERS
        $username = $userName;
        $password = $password;

        // Get Courses ID from views
        $ch = curl_init("$baseUrl/Users");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["X-Emby-Token: $apiKey"]);
        $response = curl_exec($ch);
        curl_close($ch);

        $users = json_decode($response, true);
        $firstUserId = $users[0]['Id'];

        $ch = curl_init("$baseUrl/Users/$firstUserId/Views");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["X-Emby-Token: $apiKey"]);
        $response = curl_exec($ch);
        curl_close($ch);

        $views = json_decode($response, true);

        foreach ($views['Items'] as $view) {
            if ($view['Name'] === 'Courses') {
                $coursesId = $view['Id'];
                break;
            }
        }

        if (!isset($coursesId)) {
            return "ERROR: Courses not found";
        }

        // Create user
        $ch = curl_init("$baseUrl/Users/New");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "X-Emby-Token: $apiKey",
            "Content-Type: application/json"
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'Name' => $username,
            'Password' => $password
        ]));
        $response = curl_exec($ch);
        curl_close($ch);

        $user = json_decode($response, true);
        $jellyfinUserId = $user['Id']; // Store this!

        // Get user's CURRENT policy first
        $ch = curl_init("$baseUrl/Users/$jellyfinUserId");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["X-Emby-Token: $apiKey"]);
        $response = curl_exec($ch);
        curl_close($ch);

        $userData = json_decode($response, true);
        $currentPolicy = $userData['Policy'];

        // Update policy with REQUIRED fields
        $policyData = [
            'IsAdministrator' => false,
            'IsHidden' => false,
            'IsDisabled' => false,
            'EnableUserPreferenceAccess' => true,
            'AccessSchedules' => [],
            'BlockUnratedItems' => [],
            'EnableRemoteControlOfOtherUsers' => false,
            'EnableSharedDeviceControl' => false,
            'EnableRemoteAccess' => true,
            'EnableLiveTvManagement' => false,
            'EnableLiveTvAccess' => false,
            'EnableMediaPlayback' => true,
            'EnableAudioPlaybackTranscoding' => true,
            'EnableVideoPlaybackTranscoding' => true,
            'EnableContentDeletion' => false,
            'EnableContentDeletionFromFolders' => [],
            'EnableContentDownloading' => true,
            'EnableSyncTranscoding' => false,
            'EnableMediaConversion' => false,
            'EnabledChannels' => [],
            'EnableAllChannels' => false,
            'EnabledFolders' => [$coursesId],  // ONLY COURSES
            'EnableAllFolders' => false,  // CRITICAL: MUST BE FALSE
            'InvalidLoginAttemptCount' => 0,
            'LoginAttemptsBeforeLockout' => -1,
            'MaxActiveSessions' => 0,
            'EnablePublicSharing' => false,
            'BlockedMediaFolders' => [],
            'BlockedChannels' => [],
            'RemoteClientBitrateLimit' => 0,
            'AuthenticationProviderId' => 'Jellyfin.Server.Implementations.Users.DefaultAuthenticationProvider',
            'PasswordResetProviderId' => 'Jellyfin.Server.Implementations.Users.DefaultPasswordResetProvider',
            'SyncPlayAccess' => 'CreateAndJoinGroups'
        ];

        // Merge with current policy to keep other settings
        $finalPolicy = array_merge($currentPolicy, $policyData);

        $ch = curl_init("$baseUrl/Users/$jellyfinUserId/Policy");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "X-Emby-Token: $apiKey",
            "Content-Type: application/json"
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($finalPolicy));

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        // Verify
        $ch = curl_init("$baseUrl/Users/$jellyfinUserId");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["X-Emby-Token: $apiKey"]);
        $response = curl_exec($ch);
        curl_close($ch);

        $userDetails = json_decode($response, true);

        // RETURN the Jellyfin user ID so it can be stored
        // return [
        //     'success' => true,
        //     'jellyfin_user_id' => $jellyfinUserId,
        //     'jellyfin_username' => $username,
        //     'jellyfin_password' => $password,
        //     'courses_id' => $coursesId,
        //     'enable_all_folders' => $userDetails['Policy']['EnableAllFolders'] ?? false,
        //     'enabled_folders' => $userDetails['Policy']['EnabledFolders'] ?? []
        // ]; 
        return $password;
    }
}
