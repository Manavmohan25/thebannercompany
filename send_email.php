<?php
header('Content-Type: application/json');

// Configuration - CHANGE THIS TO YOUR EMAIL
define('RECIPIENT_EMAIL', 'bilalbinnazar@gmail.com'); // ⚠️ CHANGE TO YOUR EMAIL
define('WEBSITE_NAME', 'The Banner Company');

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Invalid request method');
}

// Sanitize and validate input
$fullName = sanitizeInput($_POST['full_name'] ?? '');
$email = sanitizeInput($_POST['email'] ?? '');
$phone = sanitizeInput($_POST['phone'] ?? '');
$subject = sanitizeInput($_POST['subject'] ?? '');
$message = sanitizeInput($_POST['message'] ?? '');

// Validate required fields
if (empty($fullName)) {
    sendResponse(false, 'Please enter your full name');
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, 'Please enter a valid email address');
}

if (empty($subject)) {
    sendResponse(false, 'Please select a subject');
}

if (empty($message)) {
    sendResponse(false, 'Please enter your message');
}

// Prepare email
$to = RECIPIENT_EMAIL;
$emailSubject = WEBSITE_NAME . ' - ' . $subject;

// Email body
$emailBody = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FF8BA7, #FF9671); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #666; margin-bottom: 5px; }
        .value { color: #333; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>🎀 New Contact Form Submission</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>From:</div>
                <div class='value'>{$fullName}</div>
            </div>
            
            <div class='field'>
                <div class='label'>Email:</div>
                <div class='value'>{$email}</div>
            </div>
            
            <div class='field'>
                <div class='label'>Phone:</div>
                <div class='value'>" . (!empty($phone) ? $phone : 'Not provided') . "</div>
            </div>
            
            <div class='field'>
                <div class='label'>Subject:</div>
                <div class='value'>{$subject}</div>
            </div>
            
            <div class='field'>
                <div class='label'>Message:</div>
                <div class='value'>" . nl2br($message) . "</div>
            </div>
        </div>
        <div class='footer'>
            <p>This email was sent from the contact form on " . WEBSITE_NAME . "</p>
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: " . WEBSITE_NAME . " <noreply@thebannercompany.com>" . "\r\n";
$headers .= "Reply-To: {$email}" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
if (mail($to, $emailSubject, $emailBody, $headers)) {
    // Log submission (optional)
    logSubmission($fullName, $email, $subject);
    
    sendResponse(true, 'Thank you for your message! We will get back to you within 24 hours.');
} else {
    sendResponse(false, 'Sorry, there was an error sending your message. Please try again or email us directly at ' . RECIPIENT_EMAIL);
}

/**
 * Sanitize input data
 */
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Send JSON response
 */
function sendResponse($success, $message) {
    echo json_encode([
        'success' => $success,
        'message' => $message
    ]);
    exit;
}

/**
 * Log submission to file (optional)
 */
function logSubmission($name, $email, $subject) {
    $logFile = 'contact_submissions.log';
    $logEntry = date('Y-m-d H:i:s') . " - {$name} ({$email}) - {$subject}\n";
    
    // Create log directory if it doesn't exist
    $logDir = dirname($logFile);
    if (!file_exists($logDir) && $logDir !== '.') {
        mkdir($logDir, 0755, true);
    }
    
    file_put_contents($logFile, $logEntry, FILE_APPEND);
}
?>