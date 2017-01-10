<?php
    $f = null;
    if(file_exists("js/compress/compressed.js")){
        unlink("js/compress/compressed.js");
        $f = fopen("js/compress/compressed.js",'a');

        $start = file_get_contents("js/compress/start.js");
        $end = file_get_contents("js/compress/end.js");

        $files = array(
            file_get_contents("js/main.js"),
            file_get_contents("js/server/client.js"),
            file_get_contents("js/connection/ajax_login.js"),
            file_get_contents("js/connection/ajax_stats.js"),
            file_get_contents("js/pages/login.js"),
            file_get_contents("js/pages/setupFields.js"),
            file_get_contents("js/pages/setup.js"),
            file_get_contents("js/pages/game.js"),
            file_get_contents("js/pages/chat.js"),
            file_get_contents("js/pages/user.js"),
        );
        fwrite($f,$start);
        for ($i=0; $i < count($files); $i++) {
            fwrite($f,$files[$i]);
        }
        fwrite($f,$end);
        fclose($f);
    }
?>
<script src="js/compress/compressed.js"></script>
</body>
</html>
