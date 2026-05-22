<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class CloudinaryService
{
    protected string $cloudName;
    protected string $apiKey;
    protected string $apiSecret;

    /**
     * Initialize CloudinaryService with configuration
     */
    public function __construct()
    {
        $this->cloudName = (string) config('services.cloudinary.cloud_name', '');
        $this->apiKey = (string) config('services.cloudinary.api_key', '');
        $this->apiSecret = (string) config('services.cloudinary.api_secret', '');
    }

    /**
     * Upload base64 image to Cloudinary (authenticated without upload preset)
     *
     * @param string $base64Image
     * @param string $folder
     * @param string|null $publicId
     * @return array
     * @throws Exception
     */
    public function uploadBase64(string $base64Image, string $folder, ?string $publicId = null): array
    {
        if (!$this->isConfigured()) {
            return $this->uploadBase64Locally($base64Image, $folder, $publicId);
        }

        // Validate base64 format
        if (!preg_match('/^data:image\/(jpeg|png|webp|gif);base64,/', $base64Image)) {
            throw new Exception('Invalid image format. Must be base64 encoded image (data:image/type;base64,...)');
        }

        try {
            $timestamp = time();

            // Build payload
            $payload = [
                'file' => $base64Image,
                'folder' => $folder,
                'timestamp' => $timestamp,
                'api_key' => $this->apiKey,
            ];

            // Add public_id if provided
            if ($publicId !== null) {
                $payload['public_id'] = $publicId;
            }

            // Generate signature from payload parameters (excluding 'file')
            $signatureParams = [
                'folder' => $folder,
                'timestamp' => $timestamp,
            ];
            if ($publicId !== null) {
                $signatureParams['public_id'] = $publicId;
            }

            // Build signature string following Cloudinary format
            // Sort params by key and build: param1=value1&param2=value2&...&api_secret
            ksort($signatureParams);
            $signatureParts = [];
            foreach ($signatureParams as $key => $value) {
                $signatureParts[] = "{$key}={$value}";
            }
            $signatureStr = implode('&', $signatureParts) . $this->apiSecret;

            $payload['signature'] = hash('sha1', $signatureStr);

            $response = Http::post(
                "https://api.cloudinary.com/v1_1/{$this->cloudName}/image/upload",
                $payload
            );

            if ($response->failed()) {
                throw new Exception($this->cloudinaryErrorMessage($response->body()));
            }

            $data = $response->json();

            return [
                'url' => $data['secure_url'],
                'public_id' => $data['public_id'],
            ];
        } catch (Exception $e) {
            throw new Exception('Image upload error: ' . $e->getMessage());
        }
    }

    /**
     * Upload file image to Cloudinary
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @param string $folder
     * @param string|null $publicId
     * @return array
     * @throws Exception
     */
    public function uploadFile(\Illuminate\Http\UploadedFile $file, string $folder, ?string $publicId = null): array
    {
        if (!$this->isConfigured()) {
            return $this->uploadFileLocally($file, $folder, $publicId);
        }

        try {
            $timestamp = time();

            // Build payload without file; the binary is attached below.
            $payload = [
                'folder' => $folder,
                'timestamp' => $timestamp,
                'api_key' => $this->apiKey,
            ];

            // Add public_id if provided
            if ($publicId !== null) {
                $payload['public_id'] = $publicId;
            }

            // Generate signature from payload parameters (excluding 'file')
            $signatureParams = [
                'folder' => $folder,
                'timestamp' => $timestamp,
            ];
            if ($publicId !== null) {
                $signatureParams['public_id'] = $publicId;
            }

            // Build signature string following Cloudinary format
            ksort($signatureParams);
            $signatureParts = [];
            foreach ($signatureParams as $key => $value) {
                $signatureParts[] = "{$key}={$value}";
            }
            $signatureStr = implode('&', $signatureParts) . $this->apiSecret;

            $payload['signature'] = hash('sha1', $signatureStr);

            $response = Http::attach(
                'file',
                fopen($file->getRealPath(), 'r'),
                $file->getClientOriginalName()
            )->post("https://api.cloudinary.com/v1_1/{$this->cloudName}/image/upload", $payload);

            if ($response->failed()) {
                throw new Exception($this->cloudinaryErrorMessage($response->body()));
            }

            $data = $response->json();

            return [
                'url' => $data['secure_url'],
                'public_id' => $data['public_id'],
            ];
        } catch (Exception $e) {
            throw new Exception('Image upload error: ' . $e->getMessage());
        }
    }

    /**
     * Delete image from Cloudinary
     *
     * @param string $publicId
     * @return bool
     * @throws Exception
     */
    public function delete(string $publicId): bool
    {
        if (!$this->isConfigured()) {
            return $this->deleteLocalFile($publicId);
        }

        try {
            $timestamp = time();
            $signature = hash('sha1', "public_id={$publicId}&timestamp={$timestamp}{$this->apiSecret}");

            $response = Http::post(
                "https://api.cloudinary.com/v1_1/{$this->cloudName}/image/destroy",
                [
                    'public_id' => $publicId,
                    'api_key' => $this->apiKey,
                    'timestamp' => $timestamp,
                    'signature' => $signature,
                ]
            );

            if ($response->failed()) {
                throw new Exception($this->cloudinaryErrorMessage($response->body(), 'Cloudinary delete failed'));
            }

            $data = $response->json();

            return $data['result'] === 'ok';
        } catch (Exception $e) {
            throw new Exception('Image delete error: ' . $e->getMessage());
        }
    }

    private function ensureConfigured(): void
    {
        $missing = collect([
            'CLOUDINARY_CLOUD_NAME' => $this->cloudName,
            'CLOUDINARY_API_KEY' => $this->apiKey,
            'CLOUDINARY_API_SECRET' => $this->apiSecret,
        ])->filter(fn ($value) => $this->isMissingConfig($value))->keys()->all();

        if ($missing !== []) {
            throw new Exception(
                'Konfigurasi Cloudinary belum valid. Isi ' . implode(', ', $missing) . ' di file .env dengan data Cloudinary asli, lalu jalankan php artisan config:clear.'
            );
        }
    }

    private function isConfigured(): bool
    {
        return collect([
            $this->cloudName,
            $this->apiKey,
            $this->apiSecret,
        ])->every(fn ($value) => !$this->isMissingConfig($value));
    }

    private function isMissingConfig(string $value): bool
    {
        $value = trim($value);

        return $value === ''
            || $value === '...'
            || Str::startsWith($value, ['your_', 'isi_', 'ganti_'])
            || Str::contains($value, ['cloudinary.com', '://', '/']);
    }

    private function cloudinaryErrorMessage(string $body, string $prefix = 'Cloudinary upload failed'): string
    {
        $json = json_decode($body, true);
        $message = $json['error']['message'] ?? null;

        if (is_string($message) && trim($message) !== '') {
            return "{$prefix}: {$message}";
        }

        if (Str::contains($body, '<html')) {
            return "{$prefix}: endpoint Cloudinary tidak ditemukan. Periksa nilai CLOUDINARY_CLOUD_NAME di .env.";
        }

        return "{$prefix}: " . Str::limit(strip_tags($body), 250);
    }

    private function uploadFileLocally(\Illuminate\Http\UploadedFile $file, string $folder, ?string $publicId = null): array
    {
        $directory = $this->localDirectory($folder);
        $filename = ($publicId ? Str::slug($publicId) : Str::uuid()) . '.' . $file->getClientOriginalExtension();

        $file->move(public_path($directory), $filename);

        $path = "{$directory}/{$filename}";

        return [
            'url' => asset($path),
            'public_id' => $path,
        ];
    }

    private function uploadBase64Locally(string $base64Image, string $folder, ?string $publicId = null): array
    {
        if (!preg_match('/^data:image\/(jpeg|png|webp|gif);base64,/', $base64Image, $matches)) {
            throw new Exception('Invalid image format. Must be base64 encoded image (data:image/type;base64,...)');
        }

        $extension = $matches[1] === 'jpeg' ? 'jpg' : $matches[1];
        $data = substr($base64Image, strpos($base64Image, ',') + 1);
        $binary = base64_decode($data, true);

        if ($binary === false) {
            throw new Exception('Invalid base64 image data.');
        }

        $directory = $this->localDirectory($folder);
        $filename = ($publicId ? Str::slug($publicId) : Str::uuid()) . ".{$extension}";
        $path = "{$directory}/{$filename}";

        file_put_contents(public_path($path), $binary);

        return [
            'url' => asset($path),
            'public_id' => $path,
        ];
    }

    private function deleteLocalFile(string $publicId): bool
    {
        $path = public_path($publicId);

        if (is_file($path)) {
            return unlink($path);
        }

        return true;
    }

    private function localDirectory(string $folder): string
    {
        $directory = 'uploads/' . trim($folder, '/');

        if (!is_dir(public_path($directory))) {
            mkdir(public_path($directory), 0755, true);
        }

        return $directory;
    }
}
