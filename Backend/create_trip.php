<?php

include 'cors.php';
include 'connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid JSON data."]);
    exit();
}

$sourceCode = $data->source_code ?? null;
$destinationCode = $data->destination_code ?? null;
$distance = $data->distance ?? null;
$truckId = $data->truck_id ?? null;
$price = $data->price ?? null;

if (!$sourceCode) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing source code."]);
    exit();
}

if (!$destinationCode) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing destination code."]);
    exit();
}

if (!$distance) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing distance."]);
    exit();
}

if (!$truckId) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing truck ID."]);
    exit();
}

if (!$price) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing price."]);
    exit();
}

$sql = "INSERT INTO Trip (Source_Code, Destination_Code, Distance, Truck_Id, Price)
        VALUES (?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error: " . $conn->error]);
    exit();
}

$stmt->bind_param("ssdid", $sourceCode, $destinationCode, $distance, $truckId, $price);

if ($stmt->execute()) {
    $tripId = $stmt->insert_id;
    http_response_code(201);
    echo json_encode([
        "success" => true,
        "trip_id" => $tripId,
        "message" => "Trip created successfully."
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>