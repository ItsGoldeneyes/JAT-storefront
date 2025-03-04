<?php
include 'cors.php';
header("Content-Type: application/json; charset=UTF-8");

include 'connect.php';

if (!isset($_GET['receipt_id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Receipt ID is required."]);
    exit();
}

$receiptId = $_GET['receipt_id'];

$sql = "SELECT * FROM Shopping WHERE Receipt_Id = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error: " . $conn->error]);
    exit();
}

$stmt->bind_param("i", $receiptId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $shoppingDetails = $result->fetch_assoc();
    echo json_encode(["success" => true, "data" => $shoppingDetails]);
} else {
    http_response_code(404);
    echo json_encode(["success" => false, "error" => "Shopping record not found."]);
}

$stmt->close();
$conn->close();
?>