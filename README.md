# Battleship-Game made by David Andersson

## Requirements

* Since the game is multiplayer and are using a login system, you need to have NodeJS installed with a websocket module, found here and have a MySQL database ready to use.

## How to install

#### Server
* Once you have downloaded the game, you have to navigate to **Battleship-Game/js/main.js** and find

* ``` url = 'ws://domain:port' ```

* and fill in your **domain** for NodeJS

#### NodeJS

* To get the NodeJS server to work you have to navigate to # **Battleship-Game/js/server/websocket_game.js** and find

* `var port = `

* and change to your **port** of choice, you also need to change

* `WebSocketServer = require('PATH').server`

* to the path of the websocket module for NodeJS.

* Find the function

* `function originIsAllowed(origin) {`

* `if(origin === 'http://localhost:8080' || origin === 'url') {`

* And change **'url'** to the url you are using with port

#### Database

* To get the database working you first need to have a MySQL database up and running, use this [SQL code](http://www.student.bth.se/~daae15/dbwebb-kurser/javascript/me/kmom10/sqlCode.txt) to create the tables needed.

* Then you need to navigate to **Battleship-Game/ajax/db.php** and find

- `$hostname = '';`

- `$username = '';`

- `$password = '';`

- `$dbname = 'database name';`

* Change **values** to your settings.
