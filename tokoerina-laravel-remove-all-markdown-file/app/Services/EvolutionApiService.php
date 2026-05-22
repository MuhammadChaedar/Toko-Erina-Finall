<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class EvolutionApiService
{
    protected string $baseUrl;
    protected string $apiKey;
    protected string $instanceName;

    /**
     * Initialize EvolutionApiService with configuration
     */
    public function __construct()
    {
        $this->baseUrl = rtrim(config('services.evolution.url'), '/');
        $this->apiKey = config('services.evolution.api_key');
        $this->instanceName = config('services.evolution.instance_name');
    }

    /**
     * Check validity of a WhatsApp number
     *
     * @param string $number Single phone number to check
     * @return array|null Returns array with keys: exists, jid, name, number. Null if check fails.
     *                    Example: ["exists" => true, "jid" => "6281313747177@s.whatsapp.net", "name" => "jek", "number" => "6281313747177"]
     */
    public function checkWhatsappNumbers(string $number): array|null
    {
        try {
            // Format the number first
            $formattedNumber = $this->formatNumber($number);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'apikey' => $this->apiKey,
            ])->post(
                "{$this->baseUrl}/chat/whatsappNumbers/{$this->instanceName}",
                ['numbers' => [$formattedNumber]]
            );

            if ($response->failed()) {
                throw new Exception('Evolution API check failed: ' . $response->body());
            }

            // API returns array of objects, get the first one
            $responseData = $response->json();
            
            if (empty($responseData)) {
                return null;
            }

            // Convert to associative array if it's an object
            $result = (array) $responseData[0];

            return [
                'exists' => $result['exists'] ?? false,
                'jid' => $result['jid'] ?? null,
                'name' => $result['name'] ?? null,
                'number' => $result['number'] ?? null,
            ];
        } catch (Exception $e) {
            Log::error('WhatsApp number check error: ' . $e->getMessage(), [
                'phone_number' => $number,
            ]);
            return null;
        }
    }

    /**
     * Send text message via WhatsApp
     *
     * @param string $number
     * @param string $text
     * @return array
     * @throws Exception
     */
    public function sendText(string $number, string $text): array
    {
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'apikey' => $this->apiKey,
            ])->post(
                "{$this->baseUrl}/message/sendText/{$this->instanceName}",
                [
                    'number' => $number,
                    'text' => $text,
                ]
            );

            if ($response->failed()) {
                throw new Exception('Evolution API send failed: ' . $response->body());
            }

            return $response->json();
        } catch (Exception $e) {
            throw new Exception('WhatsApp send error: ' . $e->getMessage());
        }
    }

    /**
     * Format phone number to international format
     *
     * @param string $number
     * @return string
     */
    protected function formatNumber(string $number): string
    {
        // Remove non-digit characters
        $cleaned = preg_replace('/\D/', '', $number);

        // Convert 08xx to 628xx
        if (str_starts_with($cleaned, '08')) {
            return '62' . substr($cleaned, 1);
        }

        return $cleaned;
    }

    /**
     * Notify admin via WhatsApp (silent fail - no exceptions thrown)
     *
     * @param string $adminNumber
     * @param string $message
     * @return bool
     */
    public function notifyAdmin(string $adminNumber, string $message): bool
    {
        try {
            // Check validity - returns array or null
            $checkResult = $this->checkWhatsappNumbers($adminNumber);

            // Verify number exists in response
            if (!$checkResult || !$checkResult['exists']) {
                Log::warning("WhatsApp number validation failed for: {$adminNumber}");
                return false;
            }

            // Send message using the formatted number
            $this->sendText($checkResult['number'], $message);

            return true;
        } catch (Exception $e) {
            // Silent fail - log but don't throw
            Log::error("WhatsApp admin notification failed: " . $e->getMessage(), [
                'admin_number' => $adminNumber,
                'message' => $message,
            ]);

            return false;
        }
    }
}
