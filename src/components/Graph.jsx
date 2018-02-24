import React, {Component} from 'react';
import { observer } from 'mobx-react';
import { Col } from 'react-grid-system';
import { grey900,lightGreen300 } from 'material-ui/styles/colors'
import { AreaChart, BarChart, Bar, Area, XAxis, YAxis, CartesianGrid, Legend, ReferenceLine, ResponsiveContainer, Tooltip } from 'recharts';
import MainStore from '../stores/MainStore';
import RaisedButton from 'material-ui/RaisedButton';

@observer
class Graph extends Component {

    render() {
        const style = {
            allTimeBtn: {float: 'right'},
            chartMargin: {top: 10, right: 30, left: -16, bottom: 0},
            recentBtn: {float: 'right', margin: '0px 24px'},
            tick: {fontSize: 10},
        };

        let {
            averagePointsPerInspection,
            averagePointsPerInspectionAllTime,
            graphData,
            graphDataAllTime,
            showAllData,
            violationTypeGraphData,
            violationTypeGraphDataAllTime
        } = MainStore;

        const data = graphData.length ? graphData.slice() : [];
        const dataAllTime = graphDataAllTime.length ? graphDataAllTime.slice() : [];
        const vGraph = violationTypeGraphData.length ? violationTypeGraphData.slice() : [];
        const vGraphAllTime = violationTypeGraphDataAllTime.length ? violationTypeGraphDataAllTime.slice() : [];

        return (
            <Col md={12} style={{padding: '10px 0px'}}>
                {data.length > 1 || showAllData ? <ResponsiveContainer width='100%' height={300}>
                        <AreaChart width={410} height={300} data={!showAllData ? data : dataAllTime} margin={style.chartMargin}>
                            <XAxis dataKey='date' tick={style.tick}/>
                            <YAxis tick={style.tick}/>
                            <CartesianGrid strokeDasharray='3 3' />
                            <Tooltip />
                            <Legend align='right' verticalAlign='top' />
                            <ReferenceLine y={!showAllData ? averagePointsPerInspection : averagePointsPerInspectionAllTime} label='Average points per inspection' stroke='red' />
                            <Area type='monotone' dataKey='violation_points' stackId='1' stroke='#8884d8' fill='#8884d8' isAnimationActive={true}/>
                        </AreaChart>
                    </ResponsiveContainer> :
                    <ResponsiveContainer width='100%' height={300}>
                        <BarChart width={410} height={300} data={!showAllData ? data : dataAllTime} margin={style.chartMargin}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='date' tick={style.tick}/>
                            <YAxis tick={style.tick}/>
                            <Tooltip />
                            <Legend align='right' verticalAlign='top' />
                            <Bar fillOpacity={.5} dataKey='violation_points' fill='#8884d8' />
                            <ReferenceLine y={!showAllData ? averagePointsPerInspection : averagePointsPerInspectionAllTime} label='Average points per inspection' stroke='red'/>
                        </BarChart>
                    </ResponsiveContainer>}
                {vGraph.length >= 1 && <ResponsiveContainer width='100%' height={300}>
                    <BarChart width={410} height={300} data={!showAllData ? vGraph : vGraphAllTime} margin={style.chartMargin}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='date' tick={style.tick}/>
                    <YAxis tick={style.tick}/>
                    <Tooltip />
                    <Legend align='right' verticalAlign='top' />
                    <Bar fillOpacity={.5} dataKey='blue_violations' stackId='a' fill='#1976D2' />
                    <Bar fillOpacity={.5} dataKey='red_violations' stackId='a' fill='#D32F2F' />
                    <ReferenceLine y={!showAllData ? averagePointsPerInspection : averagePointsPerInspectionAllTime} label='Average points per inspection' stroke='red'/>
                    </BarChart>
                </ResponsiveContainer>}
                <RaisedButton label="Past 12 Months"
                              disabled={!showAllData}
                              disabledBackgroundColor={lightGreen300}
                              disabledLabelColor={grey900}
                              onClick={() => MainStore.showAllTimeData()}
                              style={style.recentBtn}
                />
                <RaisedButton label="All Time"
                              disabled={showAllData}
                              disabledBackgroundColor={lightGreen300}
                              disabledLabelColor={grey900}
                              onClick={() => MainStore.showAllTimeData()}
                              style={style.allTimeBtn}
                />
            </Col>
        )
    }
}

export default Graph;