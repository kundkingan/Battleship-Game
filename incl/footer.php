
<script src="js/jquery.js"></script>
<script src="js/main.js"></script>
<script src="js/server/client.js"></script>
<script src="js/connection/ajax_login.js"></script>
<script src="js/connection/ajax_stats.js"></script>
<script src="js/pages/login.js"></script>
<script src="js/pages/setupFields.js"></script>
<script src="js/pages/setup.js"></script>
<script src="js/pages/game.js"></script>
<script src="js/pages/chat.js"></script>
<script src="js/pages/user.js"></script>
<?php

    // $f = null;
    // if(file_exists("js/compressed.js")){
    //     unlink("js/compressed.js");
    //     $f = fopen("js/compressed/compressed.js",'a');
    //
    //     $start = file_get_contents("js/start.js");
    //     $end = file_get_contents("js/end.js");
    //
    //     $files = array(
    //         file_get_contents("js/main.js"),
    //         file_get_contents("js/server/client.js"),
    //         file_get_contents("js/connection/ajax_login.js"),
    //         file_get_contents("js/connection/ajax_stats.js"),
    //         file_get_contents("js/pages/login.js"),
    //         file_get_contents("js/pages/setupFields.js"),
    //         file_get_contents("js/pages/setup.js"),
    //         file_get_contents("js/pages/game.js"),
    //         file_get_contents("js/pages/chat.js"),
    //         file_get_contents("js/pages/user.js"),
    //     );
    //     fwrite($f,$start);
    //     for ($i=0; $i < count($files); $i++) {
    //         fwrite($f,$files[$i]);
    //     }
    //     fwrite($f,$end);
    //     fclose($f);
    // }

?>
<!-- <script src="js/compressed/compressed.js"></script> -->
</body>
</html>
