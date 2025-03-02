<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow requests from React app
//header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include 'connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get data from the request
$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    echo json_encode(["success" => false, "error" => "Invalid JSON data."]);
    exit();
}

$total_price = $data->total_price ?? null;
$delivery_truck = $data->delivery_truck ?? null;
$starting_location = $data->starting_location ?? null;
$destination = $data->destination ?? null;

if (!$total_price || !$delivery_truck || !$starting_location || !$destination) {
    echo json_encode(["error" => "Missing required fields."]);
    exit();
}

$sql = "INSERT INTO order_test (total_price, delivery_truck, starting_location, destination)
        VALUES (?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("dsss", $total_price, $delivery_truck, $starting_location, $destination);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Order created successfully."]);
} else {
    echo json_encode(["error" => "Database error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>