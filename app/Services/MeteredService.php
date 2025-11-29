<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class MeteredService
{
    protected $secretKey;
    public $domain;

    public function __construct()
    {
        $this->secretKey = config('services.metered.secret_key');
        $this->domain = config('services.metered.domain');
    }

    public function generateToken($roomName, $globalToken = false)
    {
        try {
            $url = "https://{$this->domain}/api/v1/token?secretKey={$this->secretKey}";

            $body = ['roomName' => $roomName];

            if ($globalToken) {
                $body['globalToken'] = true;
            }

            $response = Http::timeout(30)
                ->retry(3, 1000)
                ->acceptJson()
                ->post($url, $body);

            if ($response->successful()) {
                return $response->json()['token'] ?? null;
            }

            \Log::error('Token generation failed', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return null;
        } catch (\Exception $e) {
            \Log::error('Token generation exception: ' . $e->getMessage());
            return null;
        }
    }

    public function createRoom($roomName, $options = [])
    {
        try {
            $url = "https://{$this->domain}/api/v1/room?secretKey={$this->secretKey}";

            $data = array_merge([
                'roomName' => $roomName,
                'privacy' => 'private'
            ], $options);

            $response = Http::timeout(30)
                ->retry(3, 1000)
                ->acceptJson()
                ->post($url, $data);

            if ($response->successful()) {
                return $response->json();
            }

            \Log::error('Room creation failed', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return ['error' => 'Failed to create room'];
        } catch (\Exception $e) {
            \Log::error('Room creation exception: ' . $e->getMessage());
            return ['error' => $e->getMessage()];
        }
    }

    public function getRoomUrl($roomName, $withToken = true)
    {
        $url = "https://{$this->domain}/{$roomName}";

        if ($withToken) {
            $token = $this->generateToken($roomName);
            if ($token) {
                $url .= "?accessToken={$token}";
            }
        }

        return $url;
    }
}
