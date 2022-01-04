<?php

$pdo = new PDO('pgsql:host=localhost;dbname=bdgeo;port=5432;charset=utf8','postgresql','1504');

$sql = "select name, poptotal from base.bairro;";

$statement = $pdo->prepare($sql);

$statement->execute();

while($results = $statement->fetch(PDO::FETCH_ASSOC)){
    $result[] = $results;
}

echo json_encode($result);