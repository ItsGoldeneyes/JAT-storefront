
//Second approach to storing passwords (using Secure Hash algorithm by MD5)

//Insert the user with the password being hashed by MD5 first.
function insertUser($username,$password){
  $pdo = new PDO(DBCONN_STRING,DBUSERNAME,DBPASS);
  $sql = "INSERT INTO  Users(Username,Password)
         VALUES(?,?)";
  $smt = $pdo->prepare($sql);
  $smt->execute(array($username,md5($password))); //execute the query
}

//Check if the credentials match a user in the system with MD5 hash
function validateUser($username,$password){
  $pdo = new PDO(DBCONN_STRING,DBUSERNAME,DBPASS);
  $sql = "SELECT  UserID FROM Users WHERE  Username=? AND
        Password=?";
  $smt = $pdo->prepare($sql);
  $smt->execute(array($username,md5($password))); //execute the query
  if($smt->rowCount()){
    return true; //record found, return true.
  }
  return false; //record not found matching credentials, return false
}


----------------------------------------------------------------------------------------------------------------------------
Password Storage: Secure Hash Method --> MD5("password"); 

user1 password: "password"
user2 password: "password"

User Id (int) 		User Name (varchar)		Password (varchar)
1			Smith				gastiweiwcnbmxncxcvuyw28e29es
2			David				gastiweiwcnbmxncxcvuyw28e29es