<?php
header('Content-Type: application/json; charset=utf-8');

$usersFile = __DIR__ . '/users.json';
$sessionsFile = __DIR__ . '/sessions.json';

function readJson($f) { return file_exists($f) ? json_decode(file_get_contents($f), true) : []; }
function writeJson($f, $d) { file_put_contents($f, json_encode($d, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)); }

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

if (!$action) { echo json_encode(['success'=>false, 'message'=>'Не указан тип действия']); exit; }

// ===== РЕГИСТРАЦИЯ =====
if ($action === 'register') {
    $data = $input;
    $errors = [];

    // ФИО
    if (empty($data['lastname']) || empty($data['firstname'])) $errors[] = 'Заполните Фамилию и Имя';
    
    // Возраст >= 16
    if (!empty($data['dob'])) {
        $age = floor((time() - strtotime($data['dob'])) / (365.25*24*60*60));
        if ($age < 16) $errors[] = 'Регистрация доступна с 16 лет';
    } else $errors[] = 'Укажите дату рождения';

    // Телефон РБ
    if (!preg_match('/^\+375\s?\(?[1234]\d{2}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/', $data['phone'])) {
        $errors[] = 'Некорректный номер РБ';
    }

    // Email
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) $errors[] = 'Некорректный email';

    // Пароль
    $pass = $data['password'];
    $passRegex = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/';
    if (!preg_match($passRegex, $pass)) $errors[] = 'Пароль не соответствует требованиям';
    
    // Топ-100 проверка (серверная)
    $bad = ['123456','password','qwerty','12345678','12345','123456789','football','shadow','sunshine','princess','trustno1','iloveyou','batman','welcome','login','starwars','letmein','dragon','master','monkey','abc123','admin','admin123','passw0rd','p@ssword','qwerty123','1234567','password1','1q2w3e4r','1q2w3e4r5t','qazwsx','zaq12wsx','monkey123','123123','test','pass','guest','master123','changeme','123321','654321','qwerty1','asdfgh','zxcvbn','1234qwer','qwer1234','p@$$w0rd','hello','charlie','donald','password123','qwertyuiop','123456a','1234567a','abc12345','password12','12345678a','a1234567','123456789a','zxcvbnm','asdfghjkl','poiuytrewq','0987654321','qazxswedc','1qaz2wsx','1234567890','111111','000000','666666','888888','999999','777777','555555','444444','333333','222222','112233','121212'];
    if (in_array(strtolower($pass), $bad)) $errors[] = 'Пароль слишком распространённый';

    // Никнейм
    if (strlen($data['nickname']) < 3 || !preg_match('/^[a-zA-Z0-9_]+$/', $data['nickname'])) $errors[] = 'Некорректный никнейм';

    // Согласие
    if (empty($data['consent'])) $errors[] = 'Необходимо согласие с правилами';

    if (!empty($errors)) {
        echo json_encode(['success'=>false, 'message'=>implode('. ', $errors)]);
        exit;
    }

    $users = readJson($usersFile);
    foreach ($users as $u) {
        if ($u['email'] === $data['email']) { echo json_encode(['success'=>false, 'message'=>'Email уже зарегистрирован']); exit; }
        if ($u['phone'] === $data['phone']) { echo json_encode(['success'=>false, 'message'=>'Телефон уже зарегистрирован']); exit; }
        if ($u['nickname'] === $data['nickname']) { echo json_encode(['success'=>false, 'message'=>'Никнейм занят']); exit; }
    }

    $newUser = [
        'id' => count($users) + 1,
        'lastname' => $data['lastname'],
        'firstname' => $data['firstname'],
        'patronymic' => $data['patronymic'] ?? '',
        'dob' => $data['dob'],
        'phone' => $data['phone'],
        'email' => $data['email'],
        'password' => password_hash($pass, PASSWORD_DEFAULT),
        'nickname' => $data['nickname'],
        'created_at' => date('Y-m-d H:i:s')
    ];
    $users[] = $newUser;
    writeJson($usersFile, $users);

    // Сессия
    $token = bin2hex(random_bytes(32));
    $sessions = readJson($sessionsFile);
    $sessions[] = ['token'=>$token, 'user_id'=>$newUser['id'], 'nickname'=>$newUser['nickname'], 'expires_at'=>date('Y-m-d H:i:s', strtotime('+7 days'))];
    writeJson($sessionsFile, $sessions);
    setcookie('auth_token', $token, ['expires'=>time()+604800, 'path'=>'/', 'httponly'=>true, 'samesite'=>'Lax']);

    echo json_encode(['success'=>true, 'message'=>'Регистрация успешна!']);
    exit;
}

// ===== АВТОРИЗАЦИЯ =====
if ($action === 'login') {
    $login = $input['login'] ?? '';
    $pass = $input['password'] ?? '';
    if (empty($login) || empty($pass)) { echo json_encode(['success'=>false, 'message'=>'Заполните все поля']); exit; }

    $users = readJson($usersFile);
    $found = null;
    foreach ($users as $u) {
        if ($u['email'] === $login || $u['phone'] === $login) { $found = $u; break; }
    }

    if (!$found) { echo json_encode(['success'=>false, 'message'=>'Пользователь не найден']); exit; }
    if (!password_verify($pass, $found['password'])) { echo json_encode(['success'=>false, 'message'=>'Неверный пароль']); exit; }

    $token = bin2hex(random_bytes(32));
    $sessions = readJson($sessionsFile);
    $sessions = array_values(array_filter($sessions, fn($s)=>$s['user_id'] !== $found['id']));
    $sessions[] = ['token'=>$token, 'user_id'=>$found['id'], 'nickname'=>$found['nickname'], 'expires_at'=>date('Y-m-d H:i:s', strtotime('+7 days'))];
    writeJson($sessionsFile, $sessions);
    setcookie('auth_token', $token, ['expires'=>time()+604800, 'path'=>'/', 'httponly'=>true, 'samesite'=>'Lax']);

    echo json_encode(['success'=>true, 'message'=>'Успешный вход!', 'user'=>['id'=>$found['id'], 'nickname'=>$found['nickname']]]);
    exit;
}

echo json_encode(['success'=>false, 'message'=>'Неизвестное действие']);
?>