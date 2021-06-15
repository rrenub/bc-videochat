const emailService = require('./utils/email')
const throng = require('throng');
const Queue = require("bull");
const axios = require('axios')
const crypto = require('crypto');
const constants = require('./utils/constants')

// Spin up multiple processes to handle jobs to take advantage of more CPU cores
const workers = process.env.WEB_CONCURRENCY || 1;

// The maximum number of jobs each worker should process at once. 
const maxJobsPerWorker = 1;

// Connect to the named work queue
const workQueue = new Queue('work', constants.REDIS_URL);
const verifyQueue = new Queue('verifyhash', constants.REDIS_URL);
const sendEmail = new Queue('sendemail', constants.REDIS_URL);

function start() {
    console.log('Worker running')

    /**
     * Procesa cálculo de hash del audio para añadir a la blockchain
     */
    workQueue.process(maxJobsPerWorker, async (job, done) => {
        console.log('[work] New intervention to hash received: ', job.data)
        const {url, meetingID, interventionID} = job.data

        let interventionToken;
        try {
            interventionToken = await getAudioHash(url)  
        } catch(error) {
            throw new Error('Error al realizar proceso de hash', error);
        }

        console.log(interventionToken)    

        const result = {
            interventionToken: interventionToken,
            interventionID: interventionID,
            meetingID: meetingID
        }
        
        console.log('New intervention hashed', result)
        done(null, result);
    });

    /**
     * Procesa cálculo de hash del audio para verificar validez del audio de la intervención
     */
    verifyQueue.process(maxJobsPerWorker, async (job, done) => {
        console.log('[verify] New intervention to hash received: ', job.data)
        const { url } = job.data

        let interventionToken;
        try {
            interventionToken = await getAudioHash(url)  
        } catch(error) {
            done(null, {
                result: 'error'
            });
        }

        console.log(interventionToken)    

        const result = {
            interventionToken: interventionToken,
        }
        
        console.log('New intervention calculated', result)
        done(null, result);
    });

    /**
     * Procesa el envío de emails
     */
    sendEmail.process(maxJobsPerWorker, async (job, done) => {
        const { users, subject, text } = job.data
        console.log('sending email to', users, subject, text)

        //Envía un email a cada usuario
        users.forEach(user => {
            emailService.sendEmail({
                to: user,
                subject,
                text
            })
        })

        done(null);
    })
}

/**
 * Descarga el audio del url y genera un hash (token del audio) a partir del mismo
 * @param {String} url - URL del contenido multimedia 
 */
const getAudioHash = async (url) => {
    //Descarga el audio
    const config = {
        responseType: 'stream'
    };

    let response;
    try {
        response = await axios.get(url, config)
    } catch(error) {
        throw new Error('Audio no encontrado')
    }

    //Calcula el hash del audio
    var hash = crypto.createHash('sha256');
    hash.setEncoding('hex');
    return new Promise((resolve) =>  response.data.pipe(hash).on('finish', () => {
            hash.end()
            resolve(hash.read())
        })
    )
}


/* Para guardar el archivo en el servidor, usar este código 
const file = fs.createWriteStream("./file.webm");
response.data.pipe(file)
*/

// Initialize the clustered worker process
throng({ workers, start });