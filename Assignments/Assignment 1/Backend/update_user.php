<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

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
$name = $data->name ?? null;
$telephone = $data->telephone ?? null;
$address = $data->address ?? null;

if (!$email || !$name || !$telephone || !$address) {
    echo json_encode(["error" => "Missing required fields."]);
    exit();
}

$sql = "UPDATE account_details SET name = ?, telephone = ?, address = ? WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $name, $telephone, $address, $email);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "User details updated successfully."]);
} else {
    echo json_encode(["error" => "Database error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
