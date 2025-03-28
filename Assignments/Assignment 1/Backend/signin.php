<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include 'cors.php';
include 'connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    error_log("Invalid JSON data: " . file_get_contents("php://input"));
    echo json_encode(["success" => false, "error" => "Invalid JSON data."]);
    exit();
}

$login_id = $data->login_id ?? null;
$password = $data->password ?? null;

if (!$login_id || !$password) {
    error_log("Missing required fields: login_id or password not provided.");
    echo json_encode(["error" => "Missing required fields."]);
    exit();
}

// Get the stored password hash and salt for the user
$sql = "SELECT id, password, salt FROM users WHERE login_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $login_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    
    // Hash the provided password with the stored salt
    $hashed_password = md5($user['salt'] . $password); // MD5 with salt
    
    // Check if the hashed password matches the stored hash
    if ($hashed_password === $user['password']) {
        $token = $user['id'] . '_' . time();
        echo json_encode(["success" => true, "token" => $token]);
    } else {
        error_log("Invalid password for login_id: $login_id");
        echo json_encode(["success" => false, "message" => "Invalid login_id or password."]);
    }
} else {
    error_log("No user found for login_id: $login_id");
    echo json_encode(["success" => false, "message" => "Invalid login_id or password."]);
}

$stmt->close();
$conn->close();
?>
