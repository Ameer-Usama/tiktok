<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);

class TikTokDownloader {
    private $user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    private $download_path = 'downloads/';
    private $api_key = '6863f9d191msh18d248d0ed8951ep1a3062jsn70136d95c5b9';
    
    public function downloadVideo($url, $option = 1) {
        try {
            // Validate URL
            if (!$this->isValidTikTokUrl($url)) {
                return $this->errorResponse('Invalid TikTok URL');
            }
            
            // Choose API based on option
            if ($option == 1) {
                return $this->downloadWithOption1($url);
            } else {
                return $this->downloadWithOption2($url);
            }
            
        } catch (Exception $e) {
            return $this->errorResponse('An error occurred: ' . $e->getMessage());
        }
    }
    
    private function isValidTikTokUrl($url) {
        return preg_match('/^https?:\/\/(www\.|vm\.)?tiktok\.com\/.+/i', $url);
    }
    
    private function downloadWithOption1($url) {
        // API 1: Without watermark
        $encodedUrl = urlencode($url);
        $apiUrl = "https://tiktok-video-downloader-api.p.rapidapi.com/media?videoUrl={$encodedUrl}";
        
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $apiUrl,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => [
                "x-rapidapi-host: tiktok-video-downloader-api.p.rapidapi.com",
                "x-rapidapi-key: {$this->api_key}"
            ],
        ]);
        
        $response = curl_exec($ch);
        $err = curl_error($ch);
        
        curl_close($ch);
        
        if ($err) {
            return $this->errorResponse("cURL Error: {$err}");
        }
        
        $result = json_decode($response, true);
        
        if (!isset($result['downloadUrl'])) {
            return $this->errorResponse('Failed to get download URL from API');
        }
        
        // Create video info
        $videoInfo = [
            'title' => isset($result['description']) ? $result['description'] : 'TikTok Video',
            'author' => isset($result['username']) ? $result['username'] : '',
            'quality' => 'Standard',
            'duration' => ''
        ];
        
        // Return download info
        return [
            'success' => true,
            'message' => 'Video processed successfully',
            'download_url' => $result['downloadUrl'],
            'filename' => 'tiktok_' . time() . '.mp4',
            'filesize' => 0, // Not available from API
            'video_info' => $videoInfo
        ];
    }
    
    private function downloadWithOption2($url) {
        // API 2: HD without watermark
        $encodedUrl = urlencode($url);
        $apiUrl = "https://tiktok-max-quality.p.rapidapi.com/download/?url={$encodedUrl}";
        
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $apiUrl,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => [
                "x-rapidapi-host: tiktok-max-quality.p.rapidapi.com",
                "x-rapidapi-key: {$this->api_key}"
            ],
        ]);
        
        $response = curl_exec($ch);
        $err = curl_error($ch);
        
        curl_close($ch);
        
        if ($err) {
            return $this->errorResponse("cURL Error: {$err}");
        }
        
        $result = json_decode($response, true);
        
        if (!isset($result['download_url']) || $result['status'] !== 'success') {
            return $this->errorResponse('Failed to get download URL from API');
        }
        
        // Create video info
        $videoInfo = [
            'title' => 'TikTok HD Video',
            'author' => '',
            'quality' => 'HD',
            'duration' => ''
        ];
        
        // Return download info
        return [
            'success' => true,
            'message' => 'HD Video processed successfully',
            'download_url' => $result['download_url'],
            'filename' => 'tiktok_hd_' . time() . '.mp4',
            'filesize' => 0, // Not available from API
            'video_info' => $videoInfo
        ];
    }
    
    private function errorResponse($message) {
        return [
            'success' => false,
            'message' => $message
        ];
    }
}

// Handle the request
try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['url']) || empty($input['url'])) {
            echo json_encode(['success' => false, 'message' => 'URL is required']);
            exit;
        }
        
        $option = isset($input['option']) ? (int)$input['option'] : 1;
        
        $downloader = new TikTokDownloader();
        $result = $downloader->downloadVideo($input['url'], $option);
        echo json_encode($result);
        
    } else {
        echo json_encode(['success' => false, 'message' => 'Only POST method allowed']);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>