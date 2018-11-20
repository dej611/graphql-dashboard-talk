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

export default class ChartContainer extends PureComponent{
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