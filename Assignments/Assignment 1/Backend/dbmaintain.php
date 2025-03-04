<?php
include 'cors.php';
include 'connect.php';

header('Content-Type: application/json');

$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : '');
$table = isset($_GET['table']) ? $_GET['table'] : '';
$query = isset($_POST['query']) ? $_POST['query'] : '';

if ($action == 'getTables') {
    $sql = "SHOW TABLES";
    $result = $conn->query($sql);
    $tables = [];
    while ($row = $result->fetch_array()) {
        $tables[] = $row[0];
    }
    echo json_encode(['tables' => $tables]);

} elseif ($action == 'preview' && !empty($table)) {
    $sql = "SELECT * FROM $table LIMIT 10";
    $result = $conn->query($sql);
    $data = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }
    echo json_encode($data);
} elseif ($action == 'execute' && !empty($query)) {
    if ($conn->query($query) === TRUE) {
        echo json_encode("Query executed successfully");
    } else {
        echo json_encode("Error: " . $conn->error);
    }
}

$conn->close();
?>
