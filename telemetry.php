<?php
	$MySql_username="USERNAME";
	$MySql_password="PASSWORD";
	$MySql_hostname="DB_HOSTNAME";
	$MySql_databasename="DB_NAME";

$ip=($_SERVER['REMOTE_ADDR']);
$ua=($_SERVER['HTTP_USER_AGENT']);
$lang=($_SERVER['HTTP_ACCEPT_LANGUAGE']);
$dl=($_POST["dl"]);
$ul=($_POST["ul"]);
$ping=($_POST["ping"]);
$jitter=($_POST["jitter"]);
$log=($_POST["log"]);

$conn = new mysqli($MySql_hostname, $MySql_username, $MySql_password, $MySql_databasename) or die("1");
$stmt = $conn->prepare("INSERT INTO speedtest_users (ip,ua,lang,dl,ul,ping,jitter,log) VALUES (?,?,?,?,?,?,?,?)") or die("2");
$stmt->bind_param("ssssssss",$ip,$ua,$lang,$dl,$ul,$ping,$jitter,$log) or die("3");
$stmt->execute() or die("4");
$stmt->close() or die("5");
$conn->close() or die("6");

?>