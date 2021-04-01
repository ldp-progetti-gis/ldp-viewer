<?php

$dsn = "pgsql:host=marte;dbname=test";
$user = "test";
$passwd = "test";

$pdo = new PDO($dsn, $user, $passwd);

$stm = $pdo->query("SELECT VERSION()");

$version = $stm->fetch();

echo $version[0] . PHP_EOL;

?>
