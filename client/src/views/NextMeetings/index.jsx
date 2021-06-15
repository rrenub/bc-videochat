import React, { useEffect } from  'react'
import useFetch from '../../hooks/use-fetch'
import NextMeetingsTable from './components/NextMeetingsTable'
import HeaderText from '../../components/HeaderText'

const NextMeetings = () => {
    const [ meetings, 
            isLoading, 
            error, 
            fetchMeetings] = useFetch('/meetings/next_meetings')
    
    useEffect(() => {
        fetchMeetings();
    }, [])

    return (
        <>
            <HeaderText>Próximas reuniones</HeaderText>
            <NextMeetingsTable 
                error={error}
                loading={isLoading}
                meetings={meetings}/>
        </>
    )
}

export default NextMeetings;