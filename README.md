# BC-Videochat

Videoconference web app that enables users to store consensus-based interventions made and agreed by meeting.

**Demo [here!](https://bc-videochat.herokuapp.com/dashboard)**

## Features

In the current version:
* Connect to online meetings created by an administrator user
* Record relevant interventions during these meetings
* Validate and listen to the interventions that have been made 
* Verify the autenticity of interventions using the blockchain 

## Behind the scenes

The project uses the frameworks, services and libraries listed below:
* **React**: for the frontend (using Ant design component library)
* **Node.js**: for the backend
* **WebRTC**: for P2P videoconference communication
* **Firebase**: for data persistence, user authentication and interventions storage system
* **bc-videochat-chain**: Using the [bc-videochat-root-peer](https://github.com/rrenub/bc-videochat-peer) and [bc-videochat-peer](https://github.com/rrenub/bc-videochat-root-peer), interventions hashes are store in the this private blockchain to verify the integrity of the interventions validated and stored in the platform

