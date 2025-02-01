<?php
$url = "mysql://root:FLpTyMNbIdUYvEYywBhmdOykHiBXgDuF@autorack.proxy.rlwy.net:41033/testnew";
$url_parts = parse_url($url);

$servername = $url_parts['host'];
$username = $url_parts['user'];
$password = $url_parts['pass'];
$port = $url_parts['port'];
$dbname = ltrim($url_parts['path'], '/');

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create table with specified columns
try {
    $createTable = "CREATE TABLE IF NOT EXISTS StRec (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        firstname VARCHAR(255) NOT NULL,
        lastname VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        course VARCHAR(255) NOT NULL,
        grade VARCHAR(10)
    )";
    if ($conn->query($createTable) === TRUE) {
        echo "Table created or already exists.";
    } else {
        throw new Exception("Error creating table: " . $conn->error);
    }
} catch (Exception $e) {
    echo $e->getMessage();
}

// Insert record
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['insert'])) {
    $firstname = $_POST['firstname'];
    $lastname = $_POST['lastname'];
    $email = $_POST['email'];
    $course = $_POST['course'];
    $grade = $_POST['grade'];

    try {
        $sql = "INSERT INTO StRec (firstname, lastname, email, course, grade) VALUES ('$firstname', '$lastname', '$email', '$course', '$grade')";
        if ($conn->query($sql) === TRUE) {
            echo "Record inserted.";
        } else {
            throw new Exception("Error inserting record: " . $conn->error);
        }
    } catch (Exception $e) {
        echo $e->getMessage();
    }
}

// Delete record
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['delete'])) {
    $id = $_POST['id'];

    try {
        $sql = "DELETE FROM StRec WHERE id = $id";
        if ($conn->query($sql) === TRUE) {
            echo "Record deleted.";
        } else {
            throw new Exception("Error deleting record: " . $conn->error);
        }
    } catch (Exception $e) {
        echo $e->getMessage();
    }
}

// Select records
$records = [];
try {
    $sql = "SELECT id, firstname, lastname, email, reg_date, course, grade FROM StRec";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $records[] = $row;
        }
    } else {
        throw new Exception("No records found.");
    }
} catch (Exception $e) {
    echo $e->getMessage();
}

$conn->close();
?>