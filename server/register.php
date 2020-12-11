<?php

$username = $_POST['username'];
$password = $_POST['password'];

$link = mysqli_connect('localhost', 'root', 'root', 'kaola');

$nickname = '新用户'.$username;

$sql = "INSERT INTO `users` VALUES(null, '$username', '$password', '$nickname')";

$res = mysqli_query($link, $sql);

if ($res) {
    echo json_encode(array(
        "message" => '注册成功',
        "code" => 1,
    ));
} else {
    echo json_encode(array(
        "message" => '注册失败',
        "code" => 0,
    ));
}



















?>