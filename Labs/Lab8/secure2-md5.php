
<?php
// Second approach to storing passwords (using Secure Hash algorithm by MD5)

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "lab8b";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$tableCheckSQL = "SHOW TABLES LIKE 'Users'";
$tableResult = $conn->query($tableCheckSQL);

if ($tableResult->num_rows == 0) {
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

    $md5Password = custom_md5($password);

    $sql = "INSERT INTO Users (Username, Password) VALUES (?, ?)";
    $smt = $conn->prepare($sql);

    if ($smt) {
        $smt->bind_param("ss", $username, $md5Password);
        $smt->execute();
        echo "User '$username' inserted successfully!<br>";
        $smt->close();
    } else {
        echo "Error: " . $conn->error . "<br>";
    }
}

function validateUser($username, $password) {
    global $conn;

    $md5Password = custom_md5($password);

    $sql = "SELECT UserID FROM Users WHERE Username=? AND Password=?";
    $smt = $conn->prepare($sql);

    if ($smt) {
        $smt->bind_param("ss", $username, $md5Password);
        $smt->execute();
        $smt->store_result();

        $isValid = $smt->num_rows > 0;
        $smt->close();
    } else {
        $isValid = false;
    }
    return $isValid;
}

function custom_md5($password) {
  $A = 0x67452301;
  $B = 0xEFCDAB89;
  $C = 0x98BADCFE;
  $D = 0x10325476;

  $password = utf8_encode($password);
  $passwordLength = strlen($password);

  // Padding (similar to MD5)
  $password .= chr(0x80);
  while ((strlen($password) % 64) != 56) {
      $password .= chr(0x00);
  }

  // Append the original message length as 64-bit integer
  $lengthBits = $passwordLength * 8;
  $password .= pack('V2', $lengthBits & 0xFFFFFFFF, ($lengthBits >> 32) & 0xFFFFFFFF);

  // Process password in 512-bit blocks
  $blocks = str_split($password, 64);
  foreach ($blocks as $block) {
      $words = array_values(unpack('V16', $block));

      $A_copy = $A;
      $B_copy = $B;
      $C_copy = $C;
      $D_copy = $D;

      for ($i = 0; $i < 64; $i++) {
          if ($i < 16) {
              $F = ($B_copy & $C_copy) | ((~$B_copy) & $D_copy);
              $k = 0xD76AA478;
              $g = $i;
          } elseif ($i < 32) {
              $F = ($B_copy & $D_copy) | ($C_copy & (~$D_copy));
              $k = 0xE8C7B756;
              $g = (5 * $i + 1) % 16;
          } elseif ($i < 48) {
              $F = $B_copy ^ $C_copy ^ $D_copy;
              $k = 0x242070DB;
              $g = (3 * $i + 5) % 16;
          } else {
              $F = $C_copy ^ ($B_copy | (~$D_copy));
              $k = 0xC1BDCEEE;
              $g = (7 * $i) % 16;
          }

          $temp = $D_copy;
          $D_copy = $C_copy;
          $C_copy = $B_copy;
          $B_copy = ($B_copy + ((($A_copy + $F + $words[$g] + $k) & 0xFFFFFFFF))) & 0xFFFFFFFF;
          $A_copy = $temp;
      }

      $A += $A_copy;
      $B += $B_copy;
      $C += $C_copy;
      $D += $D_copy;

      $A &= 0xFFFFFFFF;
      $B &= 0xFFFFFFFF;
      $C &= 0xFFFFFFFF;
      $D &= 0xFFFFFFFF;
  }

  return sprintf("%08x%08x%08x%08x", $A, $B, $C, $D);
}

insertUser("Smith", "password1");
if (validateUser("Smith", "password1")) {
  echo "Login successful!<br>";
} else {
  echo "Invalid username or password.<br>";
}

insertUser("David", "password2");
if (validateUser("David", "password2")) {
  echo "Login successful!<br>";
} else {
  echo "Invalid username or password.<br>";
}

$conn->close();
?>
