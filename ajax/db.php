<?php

error_reporting(-1);
session_name(preg_replace('/[^a-z\d]/i', '', __DIR__));
session_start();


$action = empty($_GET['action']) ? null : $_GET['action'];
$_SESSION['success'] = false;
$_SESSION['user'] = false;
$_SESSION['stats'] = false;
$_SESSION['leaderboard'] = false;

function connectToDatabase(){
    // $hostname = 'localhost';
    // $username = 'root';
    // $password = '';
    $dbname = 'daae15';
    $hostname = 'blu-ray.student.bth.se';
    $username = 'daae15';
    $password = 'Tx0\F6e&';
    $db = new PDO("mysql:host=$hostname;dbname=$dbname;", $username, $password);
    return $db;
}

function findUsername($db = null,$username = null){
    $sth = $db->prepare('SELECT name,username,password FROM battleship_users WHERE username = "' . $username .'"');
    $sth->execute();
    return $sth->fetchAll();
}

function addUser($db = null, $username = null, $password = null, $name = null){
    $password = password_hash($password, PASSWORD_DEFAULT);
    $sql = "INSERT INTO battleship_users(username,password,name) VALUES ('$username','$password','$name')";
    return $db->query($sql);
}

function getStats($db = null, $username = null){
    $sth = $db->prepare('SELECT wins,loses,hits,miss FROM battleship_users WHERE username = "' . $username .'"');
    $sth->execute();
    return $sth->fetch(PDO::FETCH_ASSOC);
}

function getLeaderboard($db = null){
    $sth = $db->prepare('SELECT username,wins,loses,hits,miss FROM battleship_users ORDER BY wins DESC  LIMIT 0,10');
    $sth->execute();
    return $sth->fetchAll(PDO::FETCH_ASSOC);
}

function updateStats($db = null, $username = null, $win = null, $hits = null, $miss = null){
    $sql = "UPDATE battleship_users SET wins = wins + 1, hits = hits + $hits, miss = miss + $miss WHERE username = '$username'";
    if(!$win){
        $sql = "UPDATE battleship_users SET loses = loses + 1,hits = hits + '$hits', miss = miss + '$miss' WHERE username = '$username'";
    }
    $stmt = $db->prepare($sql);
    return $stmt->execute();
}

if($action != null){
    if($action == 'signin') {
        $username = $_POST['username'];
        $password = $_POST['password'];
        $db = connectToDatabase();
        $result = findUsername($db,$username);

        if(!empty($result)){
            $result = $result[0];
            if($result['username'] == $username){
                 $_SESSION['user'] = $password;
                if(password_verify($password,$result['password'])){
                    $_SESSION['success'] = true;
                    $_SESSION['user'] = $username;
                }
            }
        }
    }

    if($action == 'signup'){
        $username = $_POST['username'];
        $password = $_POST['password'];
        $name = $_POST['name'];
        $db = connectToDatabase();
        $result = findUsername($db,$username);

        if(empty($result)){
            $success = addUser($db,$username,$password,$name);
            $_SESSION['success'] = true;
            $_SESSION['user'] = $username;
        }
    }

    if($action == 'stats'){
        $username = $_POST['username'];
        $db = connectToDatabase();
        $values = getStats($db,$username);
        $rows = null;
        $rows .= "<li><a class='first'>Wins</a><a class='second'>{$values['wins']}</a></li>";
        $rows .= "<li><a class='first'>Loses</a><a class='second'>{$values['loses']}</a></li>";
        $rows .= "<li><a class='first'>Hits</a><a class='second'>{$values['hits']}</a></li>";
        $rows .= "<li><a class='first'>Miss</a><a class='second'>{$values['miss']}</a></li>";
        $_SESSION['stats'] = $rows;
    }

    if($action == 'leaderboard'){
        $db = connectToDatabase();
        $values = getLeaderboard($db);
        $rows = null;
        foreach ($values as $key) {
            $wr = $key['wins'];
            if($key['loses'] != 0){
                $wr = $key['wins'] / $key['loses'];
            }
            $rows .= "<tr class=items><td>{$key['username']}</td><td>{$key['wins']}</td><td>{$wr}</td></tr>\n";
        }
        $_SESSION['leaderboard'] = $rows;
    }

    if($action == 'updateStats'){
        $db = connectToDatabase();
        $username = $_POST['username'];
        $win = $_POST['win'];
        $hits = $_POST['hits'];
        $miss = $_POST['miss'];
    }
}

echo json_encode(array('success' => $_SESSION['success'],'user' => $_SESSION['user'],'stats' => $_SESSION['stats'], 'leaderboard' => $_SESSION['leaderboard']));
