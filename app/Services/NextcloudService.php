<?php

namespace App\Services;

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Support\Facades\Log;

class NextcloudService
{
    protected $client;
    protected $baseUrl;
    protected $shareToken;

    public function __construct()
    {
        $this->baseUrl = config('services.nextcloud.url');
        $this->shareToken = config('services.nextcloud.share_token');

        $this->client = new GuzzleClient([
            'base_uri' => $this->baseUrl,
            'verify' => false,
        ]);
    }

    public function listFiles()
    {
        try {
            $url = '/public.php/webdav/';

            $response = $this->client->request('PROPFIND', $url, [
                'auth' => [$this->shareToken, ''],
                'headers' => [
                    'Depth' => '1',
                ],
            ]);

            $xml = simplexml_load_string($response->getBody()->getContents());
            $xml->registerXPathNamespace('d', 'DAV:');

            $files = collect();

            foreach ($xml->xpath('//d:response') as $item) {
                $href = (string) $item->xpath('d:href')[0];
                $contentType = (string) ($item->xpath('d:propstat/d:prop/d:getcontenttype')[0] ?? '');
                $contentLength = (int) ($item->xpath('d:propstat/d:prop/d:getcontentlength')[0] ?? 0);

                // Only include PDF files
                if ($contentType === 'application/pdf') {
                    $filename = basename(urldecode($href));
                    $files->push([
                        'name' => $filename,
                        'encoded_name' => rawurlencode($filename),
                        'size' => $contentLength,
                        'size_mb' => round($contentLength / 1024 / 1024, 2),
                    ]);
                }
            }

            Log::info('Found PDF files:', ['count' => $files->count()]);

            return $files;
        } catch (\Exception $e) {
            Log::error('Nextcloud error: ' . $e->getMessage());
            return collect([]);
        }
    }

    public function getFileUrl($filename)
    {
        $encodedFilename = rawurlencode($filename);
        return $this->baseUrl . '/s/' . $this->shareToken . '/download?path=/&files=' . $encodedFilename;
    }
}
