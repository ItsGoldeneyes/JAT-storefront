<?php
include 'cors.php';
include 'connect.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

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

$email = $data->email ?? null;
$password = $data->password ?? null;

if (!$email || !$password) {
    error_log("Missing required fields: email or password not provided.");
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
    error_log("Invalid email or password for email: $email");
    echo json_encode(["success" => false, "message" => "Invalid email or password."]);
}

$stmt->close();
$conn->close();
?>
