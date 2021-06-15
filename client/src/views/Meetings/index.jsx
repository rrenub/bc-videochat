import React, { useEffect } from  'react'
import useFetch from '../../hooks/use-fetch'
import MeetingsTable from './components/MeetingsTable'
import HeaderText from '../../components/HeaderText'

const Meetings = () => {
    const [ 
        meetings, 
        isLoading, 
        error, 
        fetchMeetings
    ] = useFetch('/meetings')

    useEffect(() => {
        fetchMeetings();
    }, [])

    return (
        <>
            <HeaderText>Reuniones realizadas</HeaderText>
            <p>
                Seleccione una reunión para consultar las intervenciones 
                realizadas en dicha intervención
            </p>
            <MeetingsTable 
                loading={isLoading}
                error={error}
                meetings={meetings}/>
        </>
    )
}

export default Meetings;