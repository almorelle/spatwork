Spatwork
=============

Simple REST API for keeping scores about who's the best in the office (just kidding).

[![Build Status](https://buildhive.cloudbees.com/job/almorelle/job/spatwork/badge/icon)](https://buildhive.cloudbees.com/job/almorelle/job/spatwork/)

Build with `mvn package dependency:copy-dependencies`.

Run with `java -cp target/classes:target/dependency/* spatwork.AppServer`.

You will need a [mongoDB](http://www.mongodb.org/) server running on localhost (you can use `-Pembedmongo` during the build).

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

Built using [restx.io](http://restx.io) and integrates with mongoDB thanks to [jongo](http://jongo.org) API.
