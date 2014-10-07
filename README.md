Spatwork
=============

Simple REST API for keeping scores about who's the best in the office (just kidding).

[![Build Status](https://buildhive.cloudbees.com/job/almorelle/job/spatwork/badge/icon)](https://buildhive.cloudbees.com/job/almorelle/job/spatwork/)

Build with `mvn package` to create an executable jar (uberjar) or use the maven profile `-Pwebapp` to create a war.

Run with `java -jar spatwork-<version>.jar` or deploy the war in any application container.

You will need a [mongoDB](http://www.mongodb.org/) server running on localhost (you can use `-Pembedmongo` for the tests) or provide the URI and db name in the environment (retrieved with System.getEnv).
* `MONGOHQ_DB_NAME` - Name of the database (e.g. restx-spatwork)
* `MONGOHQ_URL` - MongoDB instance URI (e.g. mongodb://user:pass@server\.mongohq\.com/db_name)
* `USERAPP_APP_ID` - UserApp Application ID (see [help.userapp.io] (http://help.userapp.io/customer/portal/articles/1322336-how-do-i-find-my-app-id-))

## Videos

You can provide video links for each recorded game. A `videos.json` file is expected in `webapp/videos` directory.
```JSON
[
    { "id": "2", "file": "videos/match-2-video.mp4", "web": "youtube-url" },
    { "id": "8", "file": "videos/some-kick-ass-video.mp4", "web": "dailymotion-url" },
    { "id": "8", "file": "videos/some-kick-ass-video.mp4", "web": "vimeo-url" }
]
```

## Credits

* [restx.io](http://restx.io)
* [jongo](http://jongo.org)
* [userapp.io] (http://userapp.io)
* [compose.io] (http://compose.io) (former mongohq)
