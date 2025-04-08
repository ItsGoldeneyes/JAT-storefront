<?php
include 'cors.php';
include 'connect.php';

header('Content-Type: application/json');

$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : '');
$table = isset($_GET['table']) ? $_GET['table'] : '';
$query = isset($_GET['query']) ? $_GET['query'] : (isset($_POST['query']) ? $_POST['query'] : '');

// Get the list of tables in the database
if ($action == 'getTables') {
    $sql = "SHOW TABLES";
    $result = $conn->query($sql);
    $tables = [];
    while ($row = $result->fetch_array()) {
        $tables[] = $row[0];
    }
    echo json_encode(['tables' => $tables]);

// Preview the selected table
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

// Execute a query
} elseif ($action == 'execute' && !empty($query)) {
    $response = [];
    $queryResults = [];

    $result = $conn->query($query);
    
    // If the query is not a SELECT statement, SELECT from the table to send updated data
    if ($result === TRUE) {
        $response['message'] = "Query executed successfully"; 
        // Send back updated table data
        if (!empty($table)) {
            $sql = "SELECT * FROM $table LIMIT 10";
            $selectResult = $conn->query($sql);
            $tableData = [];
            if ($selectResult->num_rows > 0) {
                while ($row = $selectResult->fetch_assoc()) {
                    $tableData[] = $row;
                }
            }
            $response['results'] = $tableData;
        }
    // For SELECT queries, just return the results
    } elseif ($result instanceof mysqli_result) {
        while ($row = $result->fetch_assoc()) {
            $queryResults[] = $row;
        }
        $response['results'] = $queryResults;
    }

    echo json_encode($response);
}

$conn->close();
?>
