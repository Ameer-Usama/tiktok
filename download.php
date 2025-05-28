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
    
    public function __construct() {
        // Create downloads directory if it doesn't exist
        if (!file_exists($this->download_path)) {
            mkdir($this->download_path, 0755, true);
        }
    }
    
    public function downloadVideo($url) {
        try {
            // Validate URL
            if (!$this->isValidTikTokUrl($url)) {
                return $this->errorResponse('Invalid TikTok URL');
            }
            
            // Get video ID from URL
            $videoId = $this->extractVideoId($url);
            if (!$videoId) {
                return $this->errorResponse('Could not extract video ID');
            }
            
            // Get video information
            $videoInfo = $this->getVideoInfo($url);
            if (!$videoInfo) {
                return $this->errorResponse('Could not fetch video information');
            }
            
            // Download video
            $downloadResult = $this->downloadVideoFile($videoInfo);
            if (!$downloadResult) {
                return $this->errorResponse('Failed to download video');
            }
            
            return $this->successResponse($downloadResult, $videoInfo);
            
        } catch (Exception $e) {
            return $this->errorResponse('An error occurred: ' . $e->getMessage());
        }
    }
    
    private function isValidTikTokUrl($url) {
        return preg_match('/^https?:\/\/(www\.|vm\.)?tiktok\.com\/.+/i', $url);
    }
    
    private function extractVideoId($url) {
        // Extract video ID from various TikTok URL formats
        if (preg_match('/\/video\/(\d+)/', $url, $matches)) {
            return $matches[1];
        }
        
        if (preg_match('/vm\.tiktok\.com\/([A-Za-z0-9]+)/', $url, $matches)) {
            // Handle short URLs by following redirect
            $finalUrl = $this->followRedirect($url);
            return $this->extractVideoId($finalUrl);
        }
        
        return null;
    }
    
    private function followRedirect($url) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_USERAGENT, $this->user_agent);
        curl_setopt($ch, CURLOPT_NOBODY, true);
        curl_exec($ch);
        $finalUrl = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
        curl_close($ch);
        
        return $finalUrl;
    }
    
    private function getVideoInfo($url) {
        // This is a simplified version - in production you'd use TikTok's API or scraping
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERAGENT, $this->user_agent);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        
        $html = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200 || !$html) {
            return null;
        }
        
        // Extract video information from HTML
        $videoInfo = $this->parseVideoInfo($html);
        
        return $videoInfo;
    }
    
    private function parseVideoInfo($html) {
        $info = array();
        
        // Extract title
        if (preg_match('/<title[^>]*>([^<]+)<\/title>/i', $html, $matches)) {
            $info['title'] = html_entity_decode(trim($matches[1]));
        }
        
        // Extract video URL - this is simplified, real implementation would be more complex
        if (preg_match('/playAddr":"([^"]+)"/', $html, $matches)) {
            $info['video_url'] = str_replace('\u002F', '/', $matches[1]);
        } else {
            // Fallback method
            $info['video_url'] = $this->getAlternativeVideoUrl($html);
        }
        
        // Extract author
        if (preg_match('/"author":"([^"]+)"/', $html, $matches)) {
            $info['author'] = $matches[1];
        }
        
        // Set default values
        $info['quality'] = 'HD';
        $info['duration'] = '15'; // Default duration
        
        return $info;
    }
    
    private function getAlternativeVideoUrl($html) {
        // Alternative method to extract video URL
        // This is a placeholder - real implementation would use proper TikTok API
        $patterns = [
            '/src":"([^"]*\.mp4[^"]*)"/i',
            '/playAddr[^:]*:[^"]*"([^"]*\.mp4[^"]*)"/i',
            '/downloadAddr[^:]*:[^"]*"([^"]*\.mp4[^"]*)"/i'
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $html, $matches)) {
                return str_replace(['\\/', '\\u002F'], '/', $matches[1]);
            }
        }
        
        return null;
    }
    
    private function downloadVideoFile($videoInfo) {
        if (!isset($videoInfo['video_url']) || empty($videoInfo['video_url'])) {
            return false;
        }
        
        $videoUrl = $videoInfo['video_url'];
        $filename = $this->generateFilename($videoInfo);
        $filepath = $this->download_path . $filename;
        
        // Download video file
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $videoUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERAGENT, $this->user_agent);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_TIMEOUT, 120);
        curl_setopt($ch, CURLOPT_REFERER, 'https://www.tiktok.com/');
        
        $videoData = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200 || !$videoData) {
            return false;
        }
        
        // Save video file
        if (file_put_contents($filepath, $videoData)) {
            return array(
                'filename' => $filename,
                'filepath' => $filepath,
                'download_url' => $this->getDownloadUrl($filename),
                'filesize' => strlen($videoData)
            );
        }
        
        return false;
    }
    
    private function generateFilename($videoInfo) {
        $title = isset($videoInfo['title']) ? $videoInfo['title'] : 'tiktok_video';
        $title = preg_replace('/[^a-zA-Z0-9\-_\.]/', '_', $title);
        $title = substr($title, 0, 50); // Limit length
        $timestamp = time();
        
        return $title . '_' . $timestamp . '.mp4';
    }
    
    private function getDownloadUrl($filename) {
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'];
        $path = dirname($_SERVER['REQUEST_URI']) . '/' . $this->download_path . $filename;
        
        return $protocol . '://' . $host . $path;
    }
    
    private function successResponse($downloadResult, $videoInfo) {
        return array(
            'success' => true,
            'message' => 'Video downloaded successfully',
            'download_url' => $downloadResult['download_url'],
            'filename' => $downloadResult['filename'],
            'filesize' => $downloadResult['filesize'],
            'video_info' => array(
                'title' => isset($videoInfo['title']) ? $videoInfo['title'] : null,
                'author' => isset($videoInfo['author']) ? $videoInfo['author'] : null,
                'duration' => isset($videoInfo['duration']) ? $videoInfo['duration'] : null,
                'quality' => isset($videoInfo['quality']) ? $videoInfo['quality'] : null
            )
        );
    }
    
    private function errorResponse($message) {
        return array(
            'success' => false,
            'message' => $message
        );
    }
    
    // Clean up old files
    public function cleanupOldFiles($maxAge = 3600) { // 1 hour
        $files = glob($this->download_path . '*');
        $now = time();
        
        foreach ($files as $file) {
            if (is_file($file) && ($now - filemtime($file)) > $maxAge) {
                unlink($file);
            }
        }
    }
}

// Handle the request
try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['url']) || empty($input['url'])) {
            echo json_encode(array('success' => false, 'message' => 'URL is required'));
            exit;
        }
        
        $downloader = new TikTokDownloader();
        
        // Clean up old files periodically
        if (rand(1, 10) === 1) {
            $downloader->cleanupOldFiles();
        }
        
        $result = $downloader->downloadVideo($input['url']);
        echo json_encode($result);
        
    } else {
        echo json_encode(array('success' => false, 'message' => 'Only POST method allowed'));
    }
    
} catch (Exception $e) {
    echo json_encode(array(
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ));
}
?>