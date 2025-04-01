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
    $response = [];
    if ($conn->query($query) === TRUE) {
        $response['message'] = "Query executed successfully";
    } else {
        $response['message'] = "Error: " . $conn->error;
    }

    $updatedTable = [];
    if (!empty($table)) {
        $sql = "SELECT * FROM $table";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $updatedTable[] = $row;
            }
        }
    }
    $response['updatedTable'] = $updatedTable;
    echo json_encode($response);
}

$conn->close();
?>
