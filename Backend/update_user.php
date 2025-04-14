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

    $data = json_decode(file_get_contents("php://input"), true);
    $name = $data['name'] ?? null;
    $telephone = $data['telephone'] ?? null;
    $address = $data['address'] ?? null;
    $city = $data['city'] ?? null;
    $email = $data['email'] ?? null;
    $password = $data['password'] ?? null;

    // Validate required fields
    if (!$name || !$telephone || !$address || !$city || !$email) {
        echo json_encode(["success" => false, "error" => "All fields are required."]);
        exit();
    }

    // Update the users table with city_code
    $update_users_sql = "UPDATE users SET city_code = ? WHERE id = ?";
    $stmt = $conn->prepare($update_users_sql);
    $stmt->bind_param("si", $city, $user_id);
    $stmt->execute();

    // Update the account_details table with name, telephone, address, and email
    $update_account_sql = "UPDATE account_details SET name = ?, telephone = ?, address = ?, email = ? WHERE user_id = ?";
    $stmt = $conn->prepare($update_account_sql);
    $stmt->bind_param("ssssi", $name, $telephone, $address, $email, $user_id);
    $stmt->execute();

    // update the password if provided
    if ($password) {
        // Generate a random salt
        $salt = base64_encode(random_bytes(12));

        $hashed_password = md5($salt . $password);
        $update_password_sql = "UPDATE users SET password = ?, salt = ? WHERE id = ?";
        $stmt = $conn->prepare($update_password_sql);
        $stmt->bind_param("ssi", $hashed_password, $salt, $user_id);
        $stmt->execute();
    }

    echo json_encode(["success" => true, "message" => "Account updated successfully."]);
} else {
    echo json_encode(["success" => false, "error" => "Invalid or expired access token."]);
}

$stmt->close();
$conn->close();
?>
