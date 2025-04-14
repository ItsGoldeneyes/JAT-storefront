<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "JAT";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// If tables don't exist, run SQL setup script
$tableCheckQuery = "SHOW TABLES LIKE 'Item'";
$result = $conn->query($tableCheckQuery);

if ($result->num_rows == 0) {
    $sqlScript = file_get_contents('SQL_script.txt');
    
    if ($conn->multi_query($sqlScript)) {
        do {
            if ($result = $conn->store_result()) {
                $result->free();
            }
        } while ($conn->more_results() && $conn->next_result());
    } else {
        die("Error executing SQL script: " . $conn->error);
    }
}

?>