import { useState } from 'react';
import axios from 'axios'
import { createToken } from '../utils/fire'
import { BACKEND_URL } from '../utils/api-config'

const useFetchData = (urlPath, payload) => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const url = BACKEND_URL.concat(urlPath)

	console.log(url)

	const load = async () => {
		console.log('realizando peticion', payload)
		setLoading(true);
		try {
			const header = await createToken();
			const response = await axios.post(url, payload, header);
			
			console.log(`[useFetch] URL:${url}. Status:${response.status}`)
			console.log('[useFetch] Response data:', response.data)

			setData(response.data);
			
			return(response.data)
		} catch (e) {
			console.log('[useFetch] Error doing fetch')
			setError(e.response.data || 'Error: check internet connection');
		} finally {
			setLoading(false);
		}
	}

	return [data, loading, error, load];
}

export default useFetchData
