<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function answer(int $status, bool $success): never {
    http_response_code($status);
    echo json_encode(['success' => $success], JSON_THROW_ON_ERROR);
    exit;
}
function only_digits(string $value): string { return preg_replace('/\D/', '', $value) ?? ''; }
function valid_phone(string $value): bool {
    $number = only_digits($value);
    if (!in_array(strlen($number), [10, 11], true)) return false;
    $ddds = [11,12,13,14,15,16,17,18,19,21,22,24,27,28,31,32,33,34,35,37,38,41,42,43,44,45,46,47,48,49,51,53,54,55,61,62,63,64,65,66,67,68,69,71,73,74,75,77,79,81,82,83,84,85,86,87,88,89,91,92,93,94,95,96,97,98,99];
    if (!in_array((int)substr($number, 0, 2), $ddds, true)) return false;
    $local = substr($number, 2);
    if (preg_match('/(\d)\1{4,}/', $local) || in_array($local, ['12345678','123456789','98765432','987654321'], true)) return false;
    return strlen($number) === 11 ? $local[0] === '9' : (bool)preg_match('/^[2-5]/', $local);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') answer(405, false);
if (!str_starts_with(strtolower($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json')) answer(415, false);
$raw = file_get_contents('php://input', false, null, 0, 10001);
if ($raw === false || strlen($raw) > 10000) answer(413, false);
$input = json_decode($raw, true);
if (!is_array($input)) answer(400, false);
foreach (['lp', 'nome', 'whatsapp', 'convenio', 'motivo', 'submission_id'] as $key) {
    if (!isset($input[$key]) || !is_string($input[$key])) answer(400, false);
}
if (!empty($input['website'])) answer(422, false);
$motivos = [
    'hematologista' => ['Encaminhamento médico','Exames alterados','Acompanhamento','Hemoterapia','Outra necessidade'],
    'oncologia' => ['Primeira consulta','Segunda opinião','Continuidade do tratamento','Outra necessidade'],
];
if (!isset($motivos[$input['lp']]) || !in_array($input['motivo'], $motivos[$input['lp']], true)) answer(422, false);
if (strlen(trim($input['nome'])) < 2 || strlen($input['nome']) > 160 || strlen($input['convenio']) > 120) answer(422, false);
if (!valid_phone($input['whatsapp']) || !preg_match('/^[a-f0-9-]{32,36}$/i', $input['submission_id'])) answer(422, false);
$payload = [
    'lp' => $input['lp'], 'nome' => trim($input['nome']), 'whatsapp' => only_digits($input['whatsapp']),
    'convenio' => trim($input['convenio']), 'motivo' => $input['motivo'],
    'submission_id' => $input['submission_id'],
];
foreach (['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid'] as $key) {
    if (isset($input[$key]) && !is_string($input[$key])) answer(400, false);
    $payload[$key] = $input[$key] ?? '';
    if (strlen($payload[$key]) > 250) answer(422, false);
}

// URL do receptor privada e fora do document root; nunca a versionar.
$configPath = '/home2/hg3ads37/.config/honcord-leads.php';
if (!is_file($configPath) || !function_exists('curl_init')) answer(503, false);
$config = require $configPath;
$url = $config['web_app_url'] ?? '';
if (!is_string($url) || !preg_match('~^https://script\.google\.com/macros/s/[^/]+/exec$~', $url)) answer(503, false);
$curl = curl_init($url);
if ($curl === false) answer(503, false);
curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload, JSON_THROW_ON_ERROR),
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS => 3,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 10,
]);
$body = curl_exec($curl);
$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);
if (!is_string($body) || $status !== 200) answer(502, false);
$response = json_decode($body, true);
if (!is_array($response) || ($response['success'] ?? null) !== true) answer(502, false);
answer(200, true);
