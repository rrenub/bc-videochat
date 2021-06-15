const blockchainController = require('express').Router();
const blockchainService = require('../models/blockchain')
const keyPair = require('../utils/keyPair')
const app = require('../app')
const constants = require('../utils/constants')
const Queue = require('bull');

//Tema de colas para verificar el token (ver donde poner)
let workQueue = new Queue('verifyhash', constants.REDIS_URL);

workQueue.on('global:completed', async (job, result) => {

	//Si ocurre un error, se notifica al cliente web
	if(result === 'error') {
		app.get("socketService").emiter('token-hash', {
			result: 'error',
		});
	}

	const token = JSON.parse(result)
	console.log('[Verify-hash Queue] Hash calculated for an intervention', token)

	//Se envía al cliente web el token generado
	app.get("socketService").emiter('token-hash', {
		message: 'token enviado',
		token
	});
})

/**
 * Ruta: /blockchain/verify
 * Descripción: Comienza el proceso de verificación:
 * 
 * 	1. Busca en la blockchain la transacción con ID de la intervención
 * 	2. Si la encuentra, verifica que ha sido firmada por la aplicación
 * 	3. Comienza una tarea en segundo plano para calcular el hash del audio de la intervención
 */
blockchainController.post('/verify', async (req, res) => {   
	console.log('/verify', req.body) 
	const { interventionID, audioURL } = req.body
	console.log('url del audio', audioURL)

	try {
		const response = await blockchainService.getTransaction(interventionID)

		if(response.status === 204) {
			console.log('Intervention not found in blockchain')
			return res.status(204).send('Intervention not found in blockchain')

		} else {
			console.log('Intervention found in blockchain', response.data)
			const{ input:{ interventionToken, signature, videoAppID } } = response.data

			const isSignatureVerified = verifySignature(interventionToken, signature)
			
			await workQueue.add({ url: audioURL });

			return res.status(200).send({
				interventionToken,
				signature,
				videoAppPublicKey: videoAppID,
				verifiedSignature: isSignatureVerified
			})
		}

	} catch (error) {
		console.error('Error: /get-token', error)
		return res.status(500).send('Error with blockchain gateway')
	}
})

/**
 * Verifica que el token fue firmado por esta aplicación
 * 
 * @param {String} token - Hash de la intervención
 * @param {String} signature - Firma almacenada en la blockchain
 */
const verifySignature = (token, signature) => {
	console.log('firma generada', keyPair.sign(token))
    return (signature === keyPair.sign(token))
}

module.exports = blockchainController