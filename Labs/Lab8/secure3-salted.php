
//Third approach: An Authentication system using salted passwords

function generateRandomSalt(){
  return base64_encode(mcrypt_create_iv(12), MCRYPT_DEV_URANDOM));
}
// Insert the user with the password salt generated, stored, and
// password hashed
function insertUser($username,$password){
  $pdo = new PDO(DBCONN_STRING,DBUSERNAME,DBPASS);
  $salt = generateRandomSalt();
  $sql = "INSERT INTO Users(Username,Password,Salt)
           VALUES(?,?,?)";
  $smt = $pdo->prepare($sql);
  $smt->execute(array($username,md5($password.$salt),$salt));
}



----------------------------------------------------------------------------------------------------------------------------
Password Storage: Salted passwords encrypted with a one-way Hash

user1: MD5("password12345a");
user2: MD5("password54321a");

User Id (int) 		User Name (varchar)	Salt		Password (varchar)
1			Smith			12345a	 	jsdkskdksdkqtywtqywcbaueiuwe64
2			David			54321a	 	flkfdlkfldkfldflkgle9wenbxvnzxuquwe