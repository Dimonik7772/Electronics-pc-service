<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function reply(int $code, bool $success, string $message): never
{
    http_response_code($code);

    echo json_encode(
        [
            'success' => $success,
            'message' => $message,
        ],
        JSON_UNESCAPED_UNICODE
    );

    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');

    reply(
        405,
        false,
        'Please submit the contact form.'
    );
}

if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 24000) {
    reply(
        413,
        false,
        'The message is too long.'
    );
}

function field(string $key): string
{
    return isset($_POST[$key]) && is_string($_POST[$key])
        ? trim($_POST[$key])
        : '';
}


function configValue(string $config, string $key): string
{
    $pattern = '/\b' . preg_quote($key, '/') . '\s*:\s*"([^"]*)"/';

    if (!preg_match($pattern, $config, $match)) {
        return '';
    }

    return trim($match[1]);
}

$name = field('name');
$email = field('email');
$service = field('service');
$message = field('message');


if (field('website') !== '') {
    reply(
        422,
        false,
        'The enquiry could not be submitted.'
    );
}


if (
    strlen($name) < 2 ||
    strlen($name) > 200 ||
    preg_match('/[\r\n]/', $name)
) {
    reply(
        422,
        false,
        'Please enter a valid name.'
    );
}


if (
    strlen($email) > 254 ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    preg_match('/[\r\n]/', $email)
) {
    reply(
        422,
        false,
        'Please enter a valid email address.'
    );
}


$allowedServices = [
    'Residential Junk Removal',
    'Commercial Junk Removal',
    'Furniture Removal',
    'Appliance Removal',
    'Yard Waste Removal',
    'Property Cleanout',
];

if (!in_array($service, $allowedServices, true)) {
    reply(
        422,
        false,
        'Please choose a service.'
    );
}


if (
    strlen($message) < 10 ||
    strlen($message) > 15000
) {
    reply(
        422,
        false,
        'Please enter a message of at least 10 characters.'
    );
}


if (!isset($_POST['privacy'])) {
    reply(
        422,
        false,
        'Please confirm the privacy policy.'
    );
}


$configPath = __DIR__ . '/config/config.js';

$rawConfig = @file_get_contents($configPath);

if ($rawConfig === false || trim($rawConfig) === '') {
    reply(
        503,
        false,
        'The enquiry service is unavailable.'
    );
}


$recipient = configValue($rawConfig, 'email');
$company = configValue($rawConfig, 'logo');
$successMessage = configValue($rawConfig, 'successMessage');


if (
    !filter_var($recipient, FILTER_VALIDATE_EMAIL) ||
    preg_match('/[\r\n]/', $recipient) ||
    str_ends_with(strtolower($recipient), '.example')
) {
    reply(
        503,
        false,
        'The enquiry service is not yet configured.'
    );
}

if ($company === '') {
    $company = 'JunkAway';
}

if ($successMessage === '') {
    $successMessage = 'Your enquiry has been sent successfully.';
}


ini_set('session.cookie_httponly', '1');
ini_set('session.cookie_samesite', 'Lax');

if (
    !empty($_SERVER['HTTPS']) &&
    $_SERVER['HTTPS'] !== 'off'
) {
    ini_set('session.cookie_secure', '1');
}

session_start();

if (
    isset($_SESSION['last_enquiry']) &&
    time() - (int) $_SESSION['last_enquiry'] < 60
) {
    reply(
        429,
        false,
        'Please wait a minute before sending another enquiry.'
    );
}


$atPosition = strrchr($recipient, '@');

if ($atPosition === false) {
    reply(
        503,
        false,
        'The enquiry service is not yet configured.'
    );
}

$domain = substr($atPosition, 1);


$subject = '=?UTF-8?B?' .
    base64_encode(
        $company . ' — new enquiry'
    ) .
    '?=';


$body =
    "Name: {$name}\n" .
    "Email: {$email}\n" .
    "Service: {$service}\n" .
    "Privacy consent: yes\n\n" .
    "Message:\n{$message}";


$headers = [
    'From' => 'website@' . $domain,
    'Reply-To' => $email,
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
];


$sent = @mail(
    $recipient,
    $subject,
    $body,
    $headers
);

if (!$sent) {
    reply(
        502,
        false,
        'The enquiry could not be sent. Please try again later.'
    );
}


$_SESSION['last_enquiry'] = time();


reply(
    200,
    true,
    $successMessage
);
