import { useEffect, useState } from 'react';
import axios from 'axios'
import { createToken } from '../utils/fire'
import { BACKEND_URL } from '../utils/api-config'

const useGet = (urlPath) => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const url = BACKEND_URL.concat(urlPath)

	useEffect(async () => {
		setLoading(true);
		try {
			const header = await createToken();
			const response = await axios.get(url, header);
			
			console.log(`[useGet] URL:${url}. Status:${response.status}`)
			console.log('[useGet] Response data:', response.data)

			setData(response.data);
		} catch (e) {
			console.log('[useGet] Error doing fetch', e.response)
			setError(e.response.data || 'Error: check internet connection');
		} finally {
			setLoading(false);
		}
    }, [])

	return [data, loading, error];
}

export default useGet
