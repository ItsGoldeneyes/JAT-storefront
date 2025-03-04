<?php
include 'cors.php';
include 'connect.php';

// Fetch data from the Truck table
$sql = "SELECT * FROM Truck";
$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error: " . $conn->error]);
    exit();
}

$trucks = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $trucks[] = $row;
    }
}

http_response_code(200);
echo json_encode(["success" => true, "data" => $trucks]);

$conn->close();
?>