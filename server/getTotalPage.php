<?php


  $pagesize = $_GET['pagesize'];


  $sql = "SELECT * FROM `goods`";

  $link = mysqli_connect('localhost', 'root', 'root', 'kaola');
  $res = mysqli_query($link, $sql);
  $data = mysqli_fetch_all($res, MYSQLI_ASSOC);

  $total = ceil(count($data) / $pagesize);
  echo json_encode(array(
    "message" => "获取总数成功",
    "code" => 1,
    "total" => $total,
    "sql" => $sql
  ));



?>
