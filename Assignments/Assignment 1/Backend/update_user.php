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

session_start();
if (!isset($_SESSION['login_id'])) {
    echo json_encode(["success" => false, "error" => "User not authenticated."]);
    exit();
}

$login_id = $_SESSION['login_id'];
$data = json_decode(file_get_contents("php://input"));

$updateFields = [];
$updateValues = [];

if (!empty($data->name)) {
    $updateFields[] = "name = ?";
    $updateValues[] = $data->name;
}
if (!empty($data->telephone)) {
    $updateFields[] = "telephone = ?";
    $updateValues[] = $data->telephone;
}
if (!empty($data->address)) {
    $updateFields[] = "address = ?";
    $updateValues[] = $data->address;
}
// if (!empty($data->city)) {
//     $city_code = getCityCode($data->city); // Convert city name to code
//     $updateFields[] = "city_code = ?";
//     $updateValues[] = $city_code;
// }
if (!empty($data->email)) {
    // $checkEmailSQL = "SELECT user_id FROM account_details WHERE email = ? AND user_id != (SELECT user_id FROM users WHERE login_id = ?)";
    // $checkStmt = $conn->prepare($checkEmailSQL);
    // $checkStmt->bind_param("ss", $data->email, $login_id);
    // $checkStmt->execute();
    // $checkStmt->store_result();
    
    // if ($checkStmt->num_rows > 0) {
    //     echo json_encode(["success" => false, "error" => "Email is already in use."]);
    //     $checkStmt->close();
    //     exit();
    // }
    // $checkStmt->close();

    $updateFields[] = "email = ?";
    $updateValues[] = $data->email;
}

if (empty($updateFields)) {
    echo json_encode(["success" => false, "error" => "No fields to update."]);
    exit();
}

$sql = "UPDATE account_details SET " . implode(", ", $updateFields) . " WHERE user_id = (SELECT user_id FROM users WHERE login_id = ?)";

$stmt = $conn->prepare($sql);

$paramTypes = str_repeat("s", count($updateValues)) . "s";
$updateValues[] = $login_id;
$stmt->bind_param($paramTypes, ...$updateValues);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "User details updated successfully."]);
} else {
    echo json_encode(["error" => "Database error: " . $stmt->error]);
}

$stmt->close();
$conn->close();

// function getCityCode($city) {
//     $cityMapping = [
//         "New York" => 101,
//         "Los Angeles" => 102,
//         "Chicago" => 103,
//         "Houston" => 104
//     ];
//     return $cityMapping[$city] ?? null;
// }
?>
