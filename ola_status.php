<?php
# Include configuration file
include_once "config.php";
?>

<!DOCTYPE html>
<html>
 
<head>
  <title>OLA Status</title>
</head>
 
<body>
 
  <script>
	  var xhr = new XMLHttpRequest();
	  xhr.open('GET', "ba-simple-proxy.php?url=http://<?php echo $olahostname; ?>/json/server_stats", true);
	  xhr.send();
	  xhr.addEventListener("readystatechange", processRequest, false);
	  function processRequest(e) {
		  
	  }
	  function processRequest(e) {
		  if (xhr.readyState == 4 && xhr.status == 200) {
			  var response = JSON.parse(xhr.responseText);
		document.getElementById("instance_name").innerHTML = response.contents.instance_name;
		document.getElementById("version").innerHTML = response.contents.version ;
		document.getElementById("up_since").innerHTML = response.contents.up_since ;
		 }} 
 </script>
<p id="instance_name"></p>running version <p id="version"></p> up since<p id="up_since"></p>

</body>
 
</html>
