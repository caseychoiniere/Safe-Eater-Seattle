import React, {Component} from 'react';
import { observer } from 'mobx-react';
import {AreaChart, BarChart, Bar, Area, XAxis, YAxis, CartesianGrid, Legend, ReferenceLine, Tooltip} from 'recharts';
import Place from 'material-ui/svg-icons/maps/place';
import Phone from 'material-ui/svg-icons/communication/phone';
import MainStore from '../stores/MainStore';

@observer
class BusinessDetails extends Component {

    componentDidMount() {
        console.log(MainStore.hours)
    }

    componentDidUpdate() {
        console.log(MainStore.hours)
    }

    render() {
        const style = {
            closeBtn: { float: 'left', margin: '0px 0px 0px 6px' },
            h4: {margin: '10px 14px'},
            mapTitle: { textAlign: 'center', margin: '14px 12%' },
            icon: { verticalAlign: 'bottom' },
            tick: {fontSize: 12}
        };

        let { averagePointsPerInspection, graphData, hours , selectedRestaurant } = MainStore;

        const data = graphData.length ? graphData.slice() : [];
        const h = hours.map((d) => {
            return <li>{d}</li>
        });

        return (
            <div>
                {data.length > 1 ? <AreaChart width={410} height={300} data={data} margin={{top: 10, right: 20, left: -15, bottom: 0}}>
                        <XAxis dataKey='date' tick={style.tick}/>
                        <YAxis tick={style.tick}/>
                        <CartesianGrid strokeDasharray='3 3' />
                        <Tooltip />
                        <Legend align='right' verticalAlign='top'/>
                        <ReferenceLine y={averagePointsPerInspection} label='Average points per inspection' stroke='red'/>
                        <Area type='monotone' dataKey='violation_points' stackId='1' stroke='#8884d8' fill='#8884d8' />
                </AreaChart> : <BarChart width={410} height={300} data={data} margin={{left: -15}}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='date' tick={style.tick}/>
                        <YAxis tick={style.tick}/>
                        <Tooltip />
                        <Legend />
                        <Bar dataKey='violation_points' fill='#8884d8' />
                        <ReferenceLine y={averagePointsPerInspection} label='Average points per inspection' stroke='red'/>
                    </BarChart>
                }
                <h4 style={style.h4}>{}</h4>
                <h4 style={style.h4}><Phone style={style.icon} /><a href={selectedRestaurant.phone}>{selectedRestaurant.phone}</a> <Place style={style.icon} />{selectedRestaurant.address}</h4>
                    {/*<h3>Hours</h3>*/}
                    {/*<ul>*/}
                        {/*{h}*/}
                    {/*</ul>*/}
            </div>
        )
    }
}

export default BusinessDetails;