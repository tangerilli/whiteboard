Whiteboard
==========

An experiment with node.js, websockets and redis.

Extremely minimal and simple shared drawing area.  Multiple clients can connect, as they connect they will see the current drawing and as they draw all other connected clients drawings will update.

Tested in Chrome on the Mac and iOS on the iPhone and iPad.

Setup
-----

Install node.js and redis. Then, npm install redis hiredis socket.io express. Should then be able to run node app.js (or npm install supervisor and use that). Currently also need to edit whiteboard.js and change the default URL to include the IP address the server is actually running on (or pass it in from the jquery call in index.html). Then visit http://ip:8080 in one or more browsers and click and drag in the rectangle to draw.