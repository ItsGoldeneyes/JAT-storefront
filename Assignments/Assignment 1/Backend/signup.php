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
    echo json_encode(["success" => false, "error" => "Invalid JSON data."]);
    exit();
}

$login_id = $data->login_id ?? null;
$password = $data->password ?? null;

if (!$login_id || !$password) {
    echo json_encode(["error" => "Missing required fields."]);
    exit();
}

$sql = "INSERT INTO users (login_id, password) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $login_id, $password);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "User registered successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Error registering user."]);
}

$stmt->close();
$conn->close();
?>
