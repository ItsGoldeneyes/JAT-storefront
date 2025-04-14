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

$storeCode = $data->store_code ?? null;
$totalPrice = $data->total_price ?? null;

if (!$storeCode || !$totalPrice) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing required fields."]);
    exit();
}

$sql = "INSERT INTO Shopping (Store_Code, Total_Price)
        VALUES (?, ?)";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error: " . $conn->error]);
    exit();
}

$stmt->bind_param("sd", $storeCode, $totalPrice);

if ($stmt->execute()) {
    $receiptId = $stmt->insert_id;
    http_response_code(201);
    echo json_encode([
        "success" => true,
        "receipt_id" => $receiptId,
        "message" => "Shopping record created successfully."
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>