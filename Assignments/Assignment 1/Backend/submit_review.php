<?php
include 'cors.php';
include 'connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$user_id = isset($data['user_id']) ? $data['user_id'] : null;
$review_text = isset($data['review_text']) ? $data['review_text'] : null;
$rating = isset($data['rating']) ? $data['rating'] : null;

if (!$user_id || !$review_text || !$rating) {
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
    exit();
}

$sql = "INSERT INTO reviews (user_id, review_text, rating) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssi", $user_id, $review_text, $rating);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Review submitted successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to submit review."]);
}

$stmt->close();
$conn->close();
?>