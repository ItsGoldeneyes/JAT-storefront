<?php
include 'cors.php';
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

$date_issued = $data->date_issued ?? null;
$date_received = $data->date_received ?? null;
$total_price = $data->total_price ?? null;
$payment_code = $data->payment_code ?? null;
$user_id = $data->user_id ?? null;
$trip_id = $data->trip_id ?? null;
$receipt_id = $data->receipt_id ?? null;

$missing_fields = [];

if (!$date_issued) $missing_fields[] = 'date_issued';
if (!$total_price) $missing_fields[] = 'total_price';
if (!$payment_code) $missing_fields[] = 'payment_code';
if (!$user_id) $missing_fields[] = 'user_id';
if (!$trip_id) $missing_fields[] = 'trip_id';
if (!$receipt_id) $missing_fields[] = 'receipt_id';

if (!empty($missing_fields)) {
    echo json_encode(["error" => "Missing required fields: " . implode(', ', $missing_fields)]);
    exit();
}

$sql = "INSERT INTO Orders (date_issued, date_received, total_price, payment_code, user_id, trip_id, receipt_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssdsiii", $date_issued, $date_received, $total_price, $payment_code, $user_id, $trip_id, $receipt_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Order created successfully."]);
} else {
    echo json_encode(["error" => "Database error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>