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

$sql = "SELECT * FROM users WHERE login_id = ? AND password = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $login_id, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    $token = $user['id'] . '_' . time();
    echo json_encode(["success" => true, "token" => $token]);
} else {
    error_log("Invalid login_id or password for login_id: $login_id");
    echo json_encode(["success" => false, "message" => "Invalid login_id or password."]);
}

$stmt->close();
$conn->close();
?>
