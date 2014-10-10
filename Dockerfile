from phusion/baseimage:0.9.15
maintainer Alexis Morelle

# Prerequisites
RUN apt-get update \
    && apt-get install -y curl openjdk-7-jre\
    && rm -rf /var/lib/apt/lists/*

# Download Spatwork
RUN curl -s -o spatwork-0.6.0.jar -L http://dl.bintray.com/almorelle/Spatwork/com/github/almorelle/spatwork/0.6.0/spatwork-0.6.0.jar

# Run
expose 8081

cmd ["java", "-jar", "spatwork-0.6.0.jar", "-Drestx.mode=prod"]
