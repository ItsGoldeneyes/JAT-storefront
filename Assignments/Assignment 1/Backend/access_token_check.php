<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include 'cors.php';
// include 'connect.php';
// Issues with duplicating table creation with this script, so running connect code separately
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "JAT";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}


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

    // Query the users table to get the access level
    $user_sql = "SELECT access_level FROM users WHERE id = ?";
    $user_stmt = $conn->prepare($user_sql);
    $user_stmt->bind_param("i", $user_id);
    $user_stmt->execute();
    $user_result = $user_stmt->get_result();

    if ($user_result->num_rows > 0) {
        $user_data = $user_result->fetch_assoc();
        $access_level = $user_data['access_level'];
    } else {
        echo json_encode(["success" => false, "error" => "User not found."]);
        $user_stmt->close();
        $stmt->close();
        $conn->close();
        exit();
    }

    $user_stmt->close();

    echo json_encode([
        "success" => true,
        "user_id" => $user_id,
        "access_level" => $access_level
    ]);
} else {
    echo json_encode(["success" => false, "error" => "Invalid or expired access token."]);
}

$stmt->close();
$conn->close();
?>
