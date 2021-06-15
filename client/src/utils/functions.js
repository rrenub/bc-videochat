/**
 * Devuelve una String con la fecha a partir de los objetos Timestamp de Firebase
 * @param {TimeStamp} firebaseDate - Timestamp del SDK de Firebase
 * 
 * @return {String} Cadena de texto con la fecha
 */
export const firebaseDateFormatter = (firebaseDate) => {
    const formattedDate = new Date(firebaseDate._seconds*1000)
    return formattedDate.toLocaleString();
}