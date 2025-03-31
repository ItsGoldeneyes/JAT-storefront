<?php
include 'cors.php';
include 'connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$user_id = isset($data['user_id']) ? $data['user_id'] : null;
$access_level = isset($data['access_level']) ? $data['access_level'] : null;

// Base SQL query
$sql = "SELECT * FROM Orders";

if ($access_level === 'admin') {
    // Admin can see all orders
    $stmt = $conn->prepare($sql);
} else {
    // Regular users can only see their own orders
    $sql .= " WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $user_id);
}

// Execute the query
$stmt->execute();
$result = $stmt->get_result();

$orders = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
    echo json_encode(["success" => true, "orders" => $orders]);
} else {
    echo json_encode(["success" => false, "message" => "No orders found."]);
}

$stmt->close();
$conn->close();
?>