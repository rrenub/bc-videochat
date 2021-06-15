const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

//Clave privada estática para que no genere una nueva
const STATIC_PRIVATE_KEY_FOR_TESTING = 'c88f2d8017f17624afe3463ad89b19626243f6970a7d3eb682462335837f0112'

const videoKeyPair = (function() {
    const videoKeyPair = STATIC_PRIVATE_KEY_FOR_TESTING 
		? ec.keyFromPrivate(STATIC_PRIVATE_KEY_FOR_TESTING, 'hex') 
		: ec.genKeyPair();

    return { 
		/**
		 * Firma el token de una intervención
		 * @param {String} interventionToken - Token generado de la intervención
		 * @return {String} Firma generada
		 */
      	sign: function (interventionToken) {
        	const signature = videoKeyPair.sign(interventionToken).toDER('hex');
        	return signature
      	},

		/**
		 * Devuelve la clave pública de la pareja de claves
		 * @return {String} Clave pública
		 */
      	getPublicKey: function() {
    		return videoKeyPair.getPublic('hex'); 
      	},

		/**
		 * Comprueba el contenido de una firma
		 * @param {String} data - Datos firmados
		 * @param {String} signature - Firma generada de los datos
		 * @param {String} publicKey - Clave pública del par con el que se firmaron los datos
		 * @return {Boolean} Si la firma es valida o no
		 */
		verify: function(data, signature, publicKey) {
			const keyFromPublic = ec.keyFromPublic(publicKey, 'hex')
			return keyFromPublic.verify(data, signature);
		}
    };
})();

module.exports = videoKeyPair