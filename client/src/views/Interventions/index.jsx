import React, { useEffect } from  'react'
import { Space, Tabs } from 'antd';
import useFetch from '../../hooks/use-fetch'
import InterventionsTable from './components/InterventionsTable'
import MeetingInfo from './components/MeetingInfo'

const { TabPane } = Tabs;

const Interventions = (props) => {
    const meetingID = props.match.params.id;
    
    const [ userInterventions, 
            userLoading, 
            userError, 
            fetchUserInterventions] = useFetch('/interventions', {meetingID})

    const [ validatedInterventions,
            validatedLoading, 
            validatedError, 
            fetchValidatedInterventions] = useFetch('/interventions/validated', {meetingID})

    const [ meeting,
            meetingLoading, 
            meetingError, 
            fetchMeeting] = useFetch('/meetings/id', {meetingID})
    
    useEffect(() => {
        fetchMeeting();
        fetchUserInterventions();
    }, [])

    const handleTabChange = (activeKey) => {
        console.log('useEffect de currentTab ojito: ', activeKey)
        if(activeKey === 'user-interventions') {
            fetchUserInterventions()
        } else {
            fetchValidatedInterventions()
        } 
    }

    return (
        <>
            <Space direction="vertical" size={20}>
                <MeetingInfo 
                        error={meetingError}
                        loading={meetingLoading}
                        meeting={meeting}/>
                {
                    !meetingError 
                        ? (
                            <Tabs 
                                defaultActiveKey="1"
                                onChange={(activeKey) => handleTabChange(activeKey)}>

                                <TabPane tab="Mis intervenciones" key="user-interventions">
                                    <InterventionsTable 
                                        interventions={userInterventions}
                                        loading={userLoading}
                                        error={userError}/>
                                </TabPane>

                                <TabPane tab="Intervenciones validadas" key="validated-interventions">
                                    <InterventionsTable 
                                        interventions={validatedInterventions}
                                        loading={validatedLoading}
                                        error={validatedError}/>
                                </TabPane>
                            </Tabs>      
                        )
                        : null
                }
                            
            </Space>
        </>
    )
}

export default Interventions;