<?php
include 'cors.php';
include 'connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$item_id = isset($data['item_id']) ? $data['item_id'] : null;
$user_id = isset($data['user_id']) ? $data['user_id'] : null;
$review = isset($data['review']) ? $data['review'] : null;
$ranking_num = isset($data['ranking_num']) ? $data['ranking_num'] : null;

if (!$item_id || !$user_id || !$review || !$ranking_num) {
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
    exit();
}

$sql = "INSERT INTO reviews (item_id, user_id, review, ranking_num) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iiss", $item_id, $user_id, $review, $ranking_num);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Review submitted successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to submit review."]);
}

$stmt->close();
$conn->close();
?>