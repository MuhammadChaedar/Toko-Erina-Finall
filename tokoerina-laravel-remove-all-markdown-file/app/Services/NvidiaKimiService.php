<?php

namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;

class NvidiaKimiService
{
    protected string $apiKey;
    protected string $apiUrl = 'https://integrate.api.nvidia.com/v1/chat/completions';
    protected string $model = 'moonshotai/kimi-k2.5';
    protected int $timeout = 120; // Default 120 detik

    public function __construct()
    {
        $this->apiKey = config('services.nvidia_kimi.api_key');
        $this->timeout = config('services.nvidia_kimi.timeout', 120);

        if (!$this->apiKey) {
            throw new \Exception('NVIDIA Kimi API key not configured. Set NVIDIA_KIMI_API_KEY in .env');
        }
    }

    /**
     * Generate caption using AI
     *
     * @param string $prompt The main prompt for AI
     * @param string $productName Name of the product
     * @param string $flavor Flavor of the product
     * @param string $price Price of the product
     * @param string $description Description of the product
     * @param bool $includeEmoji Whether to include emoji
     * @return string Generated caption text
     */
    public function generateCaption(
        string $prompt,
        string $productName,
        string $flavor,
        string $price,
        string $description,
        bool $includeEmoji = true
    ): string {
        // Build the user message with product context
        $userMessage = $prompt . "\n\n" .
            "Produk: {$productName}\n" .
            "Rasa: {$flavor}\n" .
            "Harga: Rp {$price}\n" .
            "Deskripsi: {$description}";

        if (!$includeEmoji) {
            $userMessage .= "\n\nJangan gunakan emoji dalam caption.";
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->timeout($this->timeout)->post($this->apiUrl, [
                'model' => $this->model,
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => $userMessage,
                    ],
                ],
                'max_tokens' => 16384,
                'temperature' => 1.00,
                'top_p' => 1.00,
                'stream' => false,
                'chat_template_kwargs' => [
                    'thinking' => true,
                ],
            ]);

            if ($response->failed()) {
                throw new \Exception(
                    'NVIDIA Kimi API error: ' . $response->status() . ' - ' . $response->body()
                );
            }

            $data = $response->json();

            // Extract generated text from response
            if (
                isset($data['choices'][0]['message']['content'])
            ) {
                return $data['choices'][0]['message']['content'];
            }

            throw new \Exception('Invalid response format from NVIDIA Kimi API');
        } catch (\Exception $e) {
            throw new \Exception('Failed to generate caption with AI: ' . $e->getMessage());
        }
    }

    /**
     * Test connection to NVIDIA Kimi API
     *
     * @return bool
     */
    public function testConnection(): bool
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl, [
                'model' => $this->model,
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => 'Hello',
                    ],
                ],
                'max_tokens' => 100,
                'stream' => false,
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            return false;
        }
    }
}
