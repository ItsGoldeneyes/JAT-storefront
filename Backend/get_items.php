<?php
include 'cors.php';
include 'connect.php';

$sql = "SELECT * FROM Item";
$result = $conn->query($sql);

if (!$result) {
    error_log("Database error: " . $conn->error);
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error: " . $conn->error]);
    exit();
}

$items = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
}

http_response_code(200);
echo json_encode(["success" => true, "data" => $items]);

$conn->close();
?>