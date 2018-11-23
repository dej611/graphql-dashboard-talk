import React, { Component } from 'react';
import { forceSimulation, forceX, forceY, forceManyBody } from 'd3-force';

import { XYPlot, LabelSeries, MarkSeries } from 'react-vis';

const HEIGHT = 600;
const WIDTH = 600;

const colors = [
    '#19CDD7',
    '#F15C17',
    '#DDB27C',
    '#88572C',
    '#FF991F',
    '#223F9A',
    '#DA70BF',
    '#4DC19C',
    '#12939A',
    '#B7885E',
    '#FFCB99',
    '#F89570',
    '#E79FD5',
    '#89DAC1',
];

function startSimulation(props, updateState, setEndState) {
    const { data, label, size } = props;
    if (!data) {
        return;
    }

    const hasGroups = data.some( d => d.group );

    // make a group list
    const groups = !hasGroups ? [] : [ ...data.reduce( (memo, datum) => {
        memo.add(datum.group);
        return memo;
    }, new Set())];

    // copy the data
    const bubbles = data.map(d => ({
        ...d,
        label: d[label],
        size: size(d),
        radius: size(d),
        color: hasGroups ? groups.indexOf(d.group) : 1,
        style: {
            fontSize: size(d) / 2,
            fill: 'transparent'
        }
    }));

    const center = { x: WIDTH / 2, y: HEIGHT / 2 };

    const forceStrength = 0.03;

    function charge(d) {
        return - Math.pow(d.radius, 2.0) * forceStrength;
    }

    const simulation = forceSimulation()
        .velocityDecay(0.2)
        .force(
            'x',
            forceX()
                .strength(forceStrength)
                .x(center.x)
        )
        .force(
            'y',
            forceY()
                .strength(forceStrength)
                .y(center.y)
        )
        .force('charge', forceManyBody().strength(charge))
        .on('tick', () => updateState(bubbles))
        .stop();

    simulation.nodes(bubbles);

    simulation.alpha(1).restart();
    setTimeout(() => {
        setEndState()
    }, 4000);
}

class BubbleChart extends Component {

    state = {
        bubbles: [],
        animate: true,
    };

    componentDidMount() {
        startSimulation(
            this.props, 
            bubbles => {
                if(this.state.animate){
                    this.setState({ bubbles })
                }
            }, 
            () => this.setState({
                animate: false
            })
        );
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.animate !== this.state.animate || prevProps.selection !== this.props.selection){
            const selection = this.props.selection;
            const inSelection = id => selection == null || selection.includes(id);
            const bubbles = this.state.bubbles.map(({style, id, size, ...rest}) => ({
                ...rest, id, size, opacity: (inSelection(id)) ? 1 : 0.4, style: {
                    ...style,
                    fill: inSelection(id) ? 'black' : 'transparent',
                    fontSize: size
                }
            }));
            this.setState({
                bubbles
            });
        }
    }

    updateSelection = (datum) => {
        if(this.state.animate){
            return null;
        }
        if(this.props.updateSelection){
            this.props.updateSelection(datum);
        }
    }

    clearSelection = () => this.props.updateSelection && this.props.updateSelection(null);

    render() {
        const { bubbles } = this.state;
        return (
            <XYPlot width={WIDTH} height={HEIGHT} xPadding={15} yPadding={15}>
                <MarkSeries data={bubbles}
                    animation={this.state.animate}
                    sizeRange={[10, 85]}
                    colorType={'category'}
                    stroke={'#ddd'}
                    strokeWidth={2}
                    colorRange={colors}
                    onValueMouseOver={this.updateSelection}
                    onValueMouseOut={this.clearSelection}
                    onSeriesMouseOut={this.clearSelection}
                />
                <LabelSeries data={bubbles}
                    animation={this.state.animate}
                    labelAnchorX="middle"
                    labelAnchorY="middle"
                    style={{
                        fontWeight: 'bold',
                        pointerEvents: 'none',
                    }} />
            </XYPlot>
        );
    }
}

export default BubbleChart;
