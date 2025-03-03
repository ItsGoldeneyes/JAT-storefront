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

if (!$sourceCode || !$destinationCode || !$distance || !$truckId || !$price) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing required fields."]);
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