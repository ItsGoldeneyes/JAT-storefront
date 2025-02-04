<?php
// include 'db.php';
include 'db_mysql_server.php';
?>
<!DOCTYPE html>
<html>
<head>
    <title>Student Records</title>
</head>
<body>
    <h1>Student Records</h1>
    <form action="index.php" method="post">
        <input type="text" name="firstname" placeholder="First Name" required>
        <input type="text" name="lastname" placeholder="Last Name" required>
        <input type="email" name="email" placeholder="Email" required>
        <input type="text" name="course" placeholder="Course" required>
        <input type="text" name="grade" placeholder="Grade">
        <button type="submit" name="insert">Insert</button>
    </form>
    <table border="1">
        <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Registration Date</th>
            <th>Course</th>
            <th>Grade</th>
            <th>Action</th>
        </tr>
        <?php foreach ($records as $record): ?>
            <tr>
                <td><?php echo $record['id']; ?></td>
                <td><?php echo $record['firstname']; ?></td>
                <td><?php echo $record['lastname']; ?></td>
                <td><?php echo $record['email']; ?></td>
                <td><?php echo $record['reg_date']; ?></td>
                <td><?php echo $record['course']; ?></td>
                <td><?php echo $record['grade']; ?></td>
                <td>
                    <form action="index.php" method="post" style="display:inline;">
                        <input type="hidden" name="id" value="<?php echo $record['id']; ?>">
                        <button type="submit" name="delete">Delete</button>
                    </form>
                </td>
            </tr>
        <?php endforeach; ?>
    </table>
</body>
</html>