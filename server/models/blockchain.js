const videoKeyPair = require('../utils/keyPair')
const axios = require('axios')

// URL del nodo raíz de la blockchain dependiendo del entorno
const isDevelopment = process.env.ENV === 'development';
const BLOCKCHAIN_ROOT_URL = isDevelopment ?
  'http://localhost:4000' :
  'https://bc-videochat-root-peer.herokuapp.com'


/**
 * Añade el token de una intervención a la blockchain
 * @param interventionID - ID de la intervención
 * @param intervenitonToken - Hash generado del audio de la intervención
 */
const addToBlockchain = async (interventionID, interventionToken) => {
    const signature = videoKeyPair.sign(interventionToken)
    const videoAppID = videoKeyPair.getPublicKey()

    payload = {
        videoAppID,
        interventionID, 
        interventionToken, 
        signature
    }

    try {
        await axios.post(`${BLOCKCHAIN_ROOT_URL}/api/transact`, payload)
    } catch (e) {
        console.error(e);
    }
}


/**
 * Busca en la red blockchain una transacción
 * @param interventionID - ID de la intervención (transacción)
 */
const getTransaction = async (interventionID) => {
    const url = `${BLOCKCHAIN_ROOT_URL}/api/get-transaction`
	const payload = {
		interventionID
	}
    
    return await axios.post(url, payload)
}

module.exports = {
    addToBlockchain,
    getTransaction
}