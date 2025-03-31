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
$payment_type = $data->payment_type ?? null;
$payment_code = $data->payment_code ?? null;
$user_id = $data->user_id ?? null;
$trip_id = $data->trip_id ?? null;
$receipt_id = $data->receipt_id ?? null;
$item_ids = $data->item_ids ?? []; 

$missing_fields = [];

if (!$date_issued) $missing_fields[] = 'date_issued';
if (!$total_price) $missing_fields[] = 'total_price';
if (!$payment_type) $missing_fields[] = 'payment_type';
if ($payment_type !== 'payAtDoor' && !$payment_code) $missing_fields[] = 'payment_code'; // Only check payment_code if not pay_at_door
if (!$user_id) $missing_fields[] = 'user_id';
if (!$trip_id) $missing_fields[] = 'trip_id';
if (!$receipt_id) $missing_fields[] = 'receipt_id';

if (!empty($missing_fields)) {
    echo json_encode(["error" => "Missing required fields: " . implode(', ', $missing_fields)]);
    exit();
}

// Handle payment_code and salt based on payment_type
if ($payment_type === 'payAtDoor') {
    $salt = null;
    $encoded_payment_code = null;
} else {
    // Generate a random salt for encoding the payment_code
    $salt = base64_encode(random_bytes(12));
    $encoded_payment_code = md5($salt . $payment_code);
}

// Convert item_ids array to a comma-separated string
$item_ids_string = implode(',', $item_ids);

// Insert the order into the database
$sql = "INSERT INTO Orders (date_issued, date_received, total_price, payment_type, payment_code, salt, user_id, trip_id, receipt_id, item_ids)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssdsississ", $date_issued, $date_received, $total_price, $payment_type, $encoded_payment_code, $salt, $user_id, $trip_id, $receipt_id, $item_ids_string);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Order created successfully."]);
} else {
    echo json_encode(["error" => "Database error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>