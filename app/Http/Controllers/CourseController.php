<?php

namespace App\Http\Controllers;

use App\Services\NextcloudService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    protected $nextcloud;

    public function __construct(NextcloudService $nextcloud)
    {
        $this->nextcloud = $nextcloud;
    }

    public function index()
    {
        $courses = $this->nextcloud->listFiles();

        return Inertia::render('Courses/Index', [
            'courses' => $courses,
        ]);
    }

    public function show($filename)
    {
        return Inertia::render('Courses/Show', [
            'filename' => urldecode($filename),
        ]);
    }

    public function proxy($filename)
    {
        try {
            $decodedFilename = urldecode($filename);
            $shareToken = config('services.nextcloud.share_token');
            $baseUrl = config('services.nextcloud.url');

            $client = new \GuzzleHttp\Client([
                'verify' => false,
            ]);

            $url = $baseUrl . '/public.php/webdav/' . rawurlencode($decodedFilename);

            $response = $client->get($url, [
                'auth' => [$shareToken, ''],
            ]);

            return response($response->getBody())
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'inline; filename="' . $decodedFilename . '"');
        } catch (\Exception $e) {
            \Log::error('Proxy error: ' . $e->getMessage());
            abort(404, 'File not found');
        }
    }

    public function download($filename)
    {
        try {
            $decodedFilename = urldecode($filename);
            $shareToken = config('services.nextcloud.share_token');
            $baseUrl = config('services.nextcloud.url');

            $client = new \GuzzleHttp\Client([
                'verify' => false,
            ]);

            $url = $baseUrl . '/public.php/webdav/' . rawurlencode($decodedFilename);

            $response = $client->get($url, [
                'auth' => [$shareToken, ''],
            ]);

            return response($response->getBody())
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="' . $decodedFilename . '"');
        } catch (\Exception $e) {
            \Log::error('Download error: ' . $e->getMessage());
            abort(404, 'File not found');
        }
    }
}
