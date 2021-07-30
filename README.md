# 42-hypertube
Movie streaming web application. Created with Joel Palgi and Antti Vornanen. This project is still a work in progress, though close to finish.
## Task
Create a web application which allows user to search and watch movies. Application must include results from two external resources when user search for a movie. Movies must be downloaded using bittorrent protocol and be streamed on the video player at the same time.
Subtitles are also downloaded automatically.

## Constraints
Any library or a framework which creates a video stream from a torrent is forbidden.

## Solution
For this project, we chose React, TypeScript, and MobX state management for front end, TypeScript, Express, and MongoDB for back end. We used mongoose to communicate with database.
My responsibilities in this project includes:
- Searching movies from two external resources (back end)
- Downloading and streaming torrents (back end)
- Searching and downloading suitable subtitles (back end)

Most difficult part in this project was to create the Torrent Engine. I had to understand the protocol and how it works really well to be able get it working reliably.

I didn't create our Torrent Engine from scratch. I studied projects such as webtorrent and torrent-stream to give me guidelines and used multiple packages to help me:
- bittorrent-protocol to send and receive bittorrent protocol requests.
- torrent-discovery to discover peers with DHT.
- parse-torrent to parse torrent metadata.
- torrent-piece to abstract block reservation.

## Screenshots
