<?php

  $id = $_GET['goods_id'];

  $link = mysqli_connect('localhost', 'root', 'root', 'kaola');
  $res = mysqli_query($link, "SELECT * FROM `goods` WHERE `goods_id`=$id");
  $data = mysqli_fetch_all($res, MYSQLI_ASSOC);

  echo json_encode(array(
    "message" => "获取商品信息成功",
    "code" => 1,
    "info" => $data[0]
  ));

?>
