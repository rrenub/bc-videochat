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

## Download code and test locally

Firstly, cloning the project

```
git clone https://github.com/rrenub/projectGifter.git
```

Install dependencies

```
npm install && cd client && npm install
```

Start backend locally

```
npm run dev
```

Start frontend

```
cd client && npm start
```

And please, tell me in case you download it! Email to cuenta.rubendelgado@gmail.com

## License

This work was developed as part of the Final Degree Thesis in the [Escuela de Ingeniería de Telecomunciación y Electrónica](https://eite.ulpgc.es/index.php/es/) (EITE) of [University of Las Palmas de Gran Canaria](https://www.ulpgc.es/) (ULPGC) by Rubén Delgado González under supervision of Full Professor Álvaro Suárez Sarmiento and Associate Professor Elsa María Macías López, for obtaining the university technical degree of [Grado de Ingeniería de Telecomunicación](https://www2.ulpgc.es/plan-estudio/4037).

Shield: [![CC BY-NC-ND 4.0][cc-by-nc-nd-shield]][cc-by-nc-nd]

This work is licensed under a
[Creative Commons Attribution-NonCommercial-NoDerivs 4.0 International License][cc-by-nc-nd].

[![CC BY-NC-ND 4.0][cc-by-nc-nd-image]][cc-by-nc-nd]

[cc-by-nc-nd]: http://creativecommons.org/licenses/by-nc-nd/4.0/
[cc-by-nc-nd-image]: https://licensebuttons.net/l/by-nc-nd/4.0/88x31.png
[cc-by-nc-nd-shield]: https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-lightgrey.svg
