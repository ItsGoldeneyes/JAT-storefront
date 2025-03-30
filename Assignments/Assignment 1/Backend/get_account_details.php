<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include 'cors.php';
include 'connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Retrieve the Authorization header
$headers = getallheaders();
$access_token = $headers['Authorization'] ?? null;

if (!$access_token) {
    echo json_encode(["success" => false, "error" => "Authorization header missing."]);
    exit();
}

// Check if the access token exists in the access_tokens table
$sql = "SELECT user_id FROM access_tokens WHERE token = ? AND expires_at > NOW()";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $access_token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $token_data = $result->fetch_assoc();
    $user_id = $token_data['user_id'];

    // Query the account details table to get name, telephone, address, and email
    $account_sql = "SELECT name, telephone, address, email FROM account_details WHERE user_id = ?";
    $stmt = $conn->prepare($account_sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $account_result = $stmt->get_result();

    // Query the account details table to get name, telephone, address, and email
    $user_sql = "SELECT city_code FROM users WHERE id = ?";
    $stmt = $conn->prepare($user_sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $user_result = $stmt->get_result();

    if ($account_result->num_rows > 0 & $user_result->num_rows > 0) {
        $account_data = $account_result->fetch_assoc();
        $user_data = $user_result->fetch_assoc();
    } else {
        echo json_encode(["success" => false, "error" => "User not found."]);
        exit();
    }

    echo json_encode([
        "success" => true,
        "details" => [
            "user_id" => $user_id,
            "name" => $account_data['name'],
            "telephone" => $account_data['telephone'],
            "address" => $account_data['address'],
            "email" => $account_data['email'],
            "city" => $user_data['city_code']
        ]
    ]);
} else {
    echo json_encode(["success" => false, "error" => "Invalid or expired access token."]);
}

$stmt->close();
$conn->close();
?>
