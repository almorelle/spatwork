from phusion/baseimage:0.9.15
maintainer Alexis Morelle <alexis.morelle@gmail.com>

# Prerequisites
RUN apt-get update \
    && apt-get install -y curl openjdk-7-jre\
    && rm -rf /var/lib/apt/lists/*

WORKDIR /home/spatwork

# Download Spatwork
ADD target/spatwork-uberjar.jar /home/spatwork/spatwork-uberjar.jar

# Add Frontend
ADD src/main/webapp/ /home/spatwork/src/main/webapp/

# Run
expose 8081

cmd ["java", "-jar", "spatwork-uberjar.jar"]