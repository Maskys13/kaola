<?php

  $one = $_GET['cat_one'];
  $method = $_GET['sort_method'];
  $type = $_GET['sort_type'];
  $current = $_GET['current'];
  $pagesize = $_GET['pagesize'];


  $sql = "SELECT * FROM `goods`";

  if ($one != 'all') $sql .= " WHERE `cat_one_id`='$one'";

  if ($method == '价格') $sql .= " ORDER BY `goods_price` $type";


  $start = ($current - 1) * $pagesize;
  $sql .= " LIMIT $start, $pagesize";


  $link = mysqli_connect('localhost', 'root', 'root', 'kaola');
  $res = mysqli_query($link, $sql);
  $data = mysqli_fetch_all($res, MYSQLI_ASSOC);

  echo json_encode(array(
    "message" => "获取商品列表成功",
    "current" => $current,
    "code" => 1,
    "list" => $data,
  ));

?>
