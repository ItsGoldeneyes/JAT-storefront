<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include 'connect.php';

// Fetch data from the database
$sql = "SELECT * FROM order_test";
$result = $conn->query($sql);

$orders = [];
if ($result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
  }
}

echo json_encode($orders);

$conn->close();
?>