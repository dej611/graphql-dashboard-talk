import React, {PureComponent} from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';

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
`

export default class ChartContainer extends PureComponent{
    render(){
        return <div>
            Chart container
            <Query query={ALL_TAGS}>
                {({loading, error, data}) => {
                    if(loading){
                        return <p>Loading...</p>
                    }
                    if(error){
                        return <p>Error</p>
                    }
                    return <div>
                        {data.allTags.map( (tag) => {
                            return <p>[{tag.id}] - {tag.name} => {tag.meetups.length} meetups</p>
                        })}
                    </div>
                }}
            </Query>
        </div>;
    }
};