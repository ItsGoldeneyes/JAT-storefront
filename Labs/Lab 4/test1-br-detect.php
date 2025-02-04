<!DOCTYPE html>
<head>
<TITLE>PHP Browser Detection</TITLE>
</head>
<body>
<!-- <h1> Display Cross Browsers Compatibility Issues line1</h1>
<p> Display Cross Browsers Compatibility Issues line2</p> -->
<?php
echo "Detecting Browser... <br/><br/>";
function brdetect()
{
    $res = $_SERVER['HTTP_USER_AGENT'];
    // echo $res . "<br/><br/>";
    
    if (strpos($res, "Edg") !== false) {
        echo "Browser: Microsoft Edge";
        echo '<link rel="stylesheet" type="text/css" href="edge.css">';
    } else if (strpos($res, "Chrome") !== false) {
        echo "Browser: Google Chrome";
        echo '<link rel="stylesheet" type="text/css" href="chrome.css">';
    } else if (strpos($res, "Firefox") !== false) {
        echo "Browser: Firefox";
        echo '<link rel="stylesheet" type="text/css" href="firefox.css">';
    } else {
        echo "Browser: unknown";
        echo '<link rel="stylesheet" type="text/css" href="default.css">';
    }
}
brdetect( );
?>
</body></html>