<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "JAT";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Read SQL script from file
$sql = file_get_contents('SQL_script.txt');

// Execute SQL script
if ($conn->multi_query($sql)) {
  do {
    // Store first result set
    if ($result = $conn->store_result()) {
      $result->free();
    }
  } while ($conn->more_results() && $conn->next_result());
} else {
  echo "Error executing script: " . $conn->error;
}

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

?>