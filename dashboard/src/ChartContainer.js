import React, {PureComponent} from 'react';

import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import Chart from './Chart';

const ALL_TAGS = gql`
    query {
        allTags {
        id
        group
        name
        meetups {
            name
            }
        }
    }
`;

class TagChart extends PureComponent{
    render(){
        return <div>
            Meetup Tags
            <Query query={ALL_TAGS}>
                {({loading, error, data}) => {
                    if(loading){
                        return <p>Loading...</p>
                    }
                    if(error){
                        return <p>Error</p>
                    }
                    return <Chart data={data.allTags} label='name' size={tag => tag.meetups.length}/>;
                }}
            </Query>
        </div>;
    }
};

const ALL_MEETUPS = gql`
    query {
        allMeetups {
        id
        name
        tags {
            name
            }
        }
    }
`;

class MeetupChart extends PureComponent{
    render(){
        return <div>
            Meetups
            <Query query={ALL_MEETUPS}>
                {({loading, error, data}) => {
                    if(loading){
                        return <p>Loading...</p>
                    }
                    if(error){
                        return <p>Error</p>
                    }
                    return <Chart data={data.allMeetups} label='name' size={meetup => meetup.tags.length}/>;
                }}
            </Query>
        </div>;
    }
};

export default class ChartsContainer extends PureComponent{
    render(){
        return <div style={{display: 'flex', flexDirection: 'row'}}><MeetupChart /><TagChart /></div>
    }
}