<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include 'connect.php';

// Fetch data from the Store table
$sql = "SELECT * FROM Store";
$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error: " . $conn->error]);
    exit();
}

$stores = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $stores[] = [
            "store_id" => $row["store_id"],
            "name" => $row["name"],
            "store_code" => $row["store_code"],
            "position" => [
                "lat" => (float)$row["latitude"],
                "lng" => (float)$row["longitude"]
            ]
        ];
    }
}

http_response_code(200);
echo json_encode(["success" => true, "data" => $stores]);

$conn->close();
?>