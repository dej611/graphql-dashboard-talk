import React, {PureComponent} from 'react';

import {Query, Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import Chart from './Chart';

const getSelection = (type, list, selection) => {
    if(!selection){
        return null;
    }
    if(selection.type === type){
        return [selection.id];
    }
    return list.filter( (item) => {
        const prop = `${selection.type}s`;
        return item[prop].some( ({id}) => id === selection.id);
    }).map( ({id}) => id);
}

const ALL_TAGS = gql`
    query {
        allTags {
            id
            group
            name
            meetups {
                id
            }
        }
        selection @client{
            type
            id
        }
    }
`

class TagChart extends PureComponent{
    handleSelection = (selection) => {
        this.props.onSelection({selection: selection && {type: 'tag', id: selection.id, __typename: 'Selection' }});
    }
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
                    const selection = getSelection('tag', data.allTags, data.selection);
                    return <Chart 
                            data={data.allTags} 
                            label='name' 
                            size={tag => tag.meetups.length}
                            selection={selection}
                            onSelection={this.handleSelection}/>;
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
                id
            }
        }
        selection @client{
            type
            id
        }
    }
`;

class MeetupChart extends PureComponent{
    handleSelection = (selection) => {
        this.props.onSelection({selection: selection && {type: 'meetup', id: selection.id, __typename: 'Selection' }});
    }
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
                    const selection = getSelection('meetup', data.allMeetups, data.selection);
                    return <Chart 
                            data={data.allMeetups} 
                            label='name' 
                            size={meetup => meetup.tags.length} 
                            selection={selection}
                            onSelection={this.handleSelection}/>;
                }}
            </Query>
        </div>;
    }
};

const MUTATION = gql`
    mutation updateSelection($selection: Selection){
        setSelection(selection: $selection) @client
    }
`;

export default class ChartsContainer extends PureComponent{
    render(){
        return <Mutation mutation={MUTATION}>
        {setSelection => <div style={{display: 'flex', flexDirection: 'row'}}>
            <MeetupChart onSelection={(data) => setSelection({variables: data})}/>
            <TagChart onSelection={(data) => setSelection({variables: data})}/>
            </div>}
        </Mutation>
    }
}
