<?php
include_once "config.php";
$requesturl="http://$olahostname/json/server_stats";;
$ch=curl_init($requesturl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$cexecute=curl_exec($ch);
curl_close($ch);
$result = json_decode($cexecute,true);
?>

<!DOCTYPE html>
<html>
 <head>
  <title>OLA Status</title>
</head>
 
<body>
<h1>OLA Status</h1>
<div>Running version: <?php echo $result['version']; ?><br>Up since: <?php echo $result['up_since']; ?></div>

</body>
</html>
