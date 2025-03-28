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
$name = $data->name ?? null;
$telephone = $data->telephone ?? null;
$address = $data->address ?? null;
$city = $data->city ?? null;
$email = $data->email ?? null;

if (!$login_id || !$password) {
    echo json_encode(["error" => "Missing required fields."]);
    exit();
}

// $city_code = null;
// $cityQuery = "SELECT city_code FROM cities WHERE city_name = ?";
// $stmt = $conn->prepare($cityQuery);
// $stmt->bind_param("s", $city);
// $stmt->execute();
// $stmt->bind_result($city_code);
// $stmt->fetch();
// $stmt->close();

// if (!$city_code) {
//     echo json_encode(["error" => "Invalid city."]);
//     exit();
// }

$sqlUser = "INSERT INTO users (login_id, password, city_code) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sqlUser);
$stmt->bind_param("ssi", $login_id, $password, $city_code);

if ($stmt->execute()) {
    $user_id = $stmt->insert_id;
    $stmt->close();

    $sqlDetails = "INSERT INTO account_details (user_id, name, telephone, address, email) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sqlDetails);
    $stmt->bind_param("issss", $user_id, $name, $telephone, $address, $email);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "User registered successfully."]);
    } else {
        echo json_encode(["success" => false, "error" => "Error inserting account details."]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "error" => "Error registering user."]);
}

$conn->close();
?>
