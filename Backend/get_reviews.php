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
$item_id = isset($data['item_id']) ? $data['item_id'] : null;

// Base SQL query
$sql = "SELECT * FROM reviews WHERE item_id = ?";

if ($access_level !== 'admin') {
    // Regular users can only see their own reviews for the item
    $sql .= " AND user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $item_id, $user_id);
} else {
    // Admin can see all reviews for the item
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $item_id);
}

// Execute the query
$stmt->execute();
$result = $stmt->get_result();

$reviews = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $reviews[] = $row;
    }
    echo json_encode(["success" => true, "reviews" => $reviews]);
} else {
    echo json_encode(["success" => false, "message" => "No reviews found."]);
}

$stmt->close();
$conn->close();
?>
