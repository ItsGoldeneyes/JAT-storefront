<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Origin: *");
include 'connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    echo json_encode(["success" => false, "error" => "Invalid JSON data."]);
    exit();
}

$email = $data->email ?? null;
$password = $data->password ?? null;

if (!$email || !$password) {
    echo json_encode(["error" => "Missing required fields."]);
    exit();
}

$sql = "SELECT * FROM users WHERE email = ? AND password = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $email, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    $token = $user['id'] . '_' . time();
    echo json_encode(["success" => true, "token" => $token]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid email or password."]);
}

$stmt->close();
$conn->close();
?>
