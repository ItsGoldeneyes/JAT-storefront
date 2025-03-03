<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include 'connect.php';

if (!isset($_GET['trip_id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Trip ID is required."]);
    exit();
}

$tripId = $_GET['trip_id'];

$sql = "SELECT * FROM Trip WHERE Trip_Id = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error: " . $conn->error]);
    exit();
}

$stmt->bind_param("i", $tripId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $tripDetails = $result->fetch_assoc();
    echo json_encode(["success" => true, "data" => $tripDetails]);
} else {
    http_response_code(404);
    echo json_encode(["success" => false, "error" => "Trip not found for ID: $tripId"]);
}

$stmt->close();
$conn->close();
?>