Spatwork
=============

Simple REST API for keeping scores about who's the best in the office (just kidding).

[![Build Status](https://buildhive.cloudbees.com/job/almorelle/job/spatwork/badge/icon)](https://buildhive.cloudbees.com/job/almorelle/job/spatwork/)

Build with `mvn package dependency:copy-dependencies`.

Run with `java -cp target/classes:target/dependency/* spatwork.AppServer`.

You will need a [mongoDB](http://www.mongodb.org/) server running on localhost (you can use `-Pembedmongo` during the build).

## Credits

Built using [restx.io](http://restx.io) and integrates with mongoDB thanks to [jongo](http://jongo.org) API.
