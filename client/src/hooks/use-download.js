import { useState } from 'react';
import axios from 'axios'

const useDownload = (url) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const load = async () => {
		setLoading(true);

		try {
            const config = {
                responseType: 'blob'
            };

			const response = await axios.get(url, config);
            console.log(response.data)
			setData(response.data);
		} catch (e) {
			console.error('[useDownload] Error doing fetch', e.response)
			setError(e.response.data || 'Error: check internet connection');
		} finally {
			setLoading(false);
		}
	}

	return [data, loading, error, load];
}

export default useDownload
