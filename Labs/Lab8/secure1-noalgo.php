<?php
// Insert the user with the password (Plain Text - Very Insecure)

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "lab8";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the 'Users' table exists, and create it if not
$tableCheckSQL = "SHOW TABLES LIKE 'Users'";
$tableResult = $conn->query($tableCheckSQL);

if ($tableResult->num_rows == 0) {
    // Create the Users table if it doesn't exist
    $createTableSQL = "CREATE TABLE Users (
        UserID INT AUTO_INCREMENT PRIMARY KEY,
        Username VARCHAR(255) NOT NULL,
        Password VARCHAR(255) NOT NULL
    )";

    if ($conn->query($createTableSQL) === TRUE) {
        echo "Table 'Users' created successfully!<br>";
    } else {
        echo "Error creating table: " . $conn->error . "<br>";
    }
} else {
    echo "Table 'Users' already exists.<br>";
}

function insertUser($username, $password) {
    global $conn;

    // Prepare statement
    $sql = "INSERT INTO Users (Username, Password) VALUES (?, ?)";
    $smt = $conn->prepare($sql);

    if ($smt) {
        $smt->bind_param("ss", $username, $password);
        $smt->execute();
        echo "User inserted successfully!";
        $smt->close();
    } else {
        echo "Error: " . $conn->error;
    }
}

// Check if the credentials match a user in the system
function validateUser($username, $password) {
    global $conn;

    // Prepare statement
    $sql = "SELECT UserID FROM Users WHERE Username=? AND Password=?";
    $smt = $conn->prepare($sql);

    if ($smt) {
        $smt->bind_param("ss", $username, $password);
        $smt->execute();
        $smt->store_result();

        $isValid = $smt->num_rows > 0;
        $smt->close();
    } else {
        $isValid = false;
    }
    return $isValid;
}

insertUser("Smith", "password1");
if (validateUser("Smith", "password1")) {
  echo "Login successful!";
} else {
  echo "Invalid username or password.";
}

insertUser("David", "password2");
if (validateUser("David", "password2")) {
  echo "Login successful!";
} else {
  echo "Invalid username or password.";
}

$conn->close();
?>
