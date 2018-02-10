import React, {Component} from 'react';
import { observer } from 'mobx-react';
import Place from 'material-ui/svg-icons/maps/place';
import Phone from 'material-ui/svg-icons/communication/phone';
import { generateUniqueKey } from '../util/utils';
import MainStore from '../stores/MainStore';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

@observer
class BusinessDetails extends Component {

    constructor() {
        super()
        this.state = {
            showHours: false
        }
    }

    render() {
        const style = {
            closeBtn: { float: 'left', margin: '0px 0px 0px 6px' },
            heading: {margin: '14px 14px'},
            mapTitle: { textAlign: 'center', margin: '14px 12%' },
            icon: { verticalAlign: 'bottom' },
            tick: {fontSize: 12}
        };

        let { hours, selectedRestaurant } = MainStore;

        const h = hours.map((d) => {
            return (
                <TableRow key={generateUniqueKey()}>
                    <TableRowColumn>{d}</TableRowColumn>
                </TableRow>
            )
        });

        return (
            <div>
                <h4 style={style.heading}>
                    <Phone style={style.icon} />
                    <a href={selectedRestaurant.phone}>{selectedRestaurant.phone}</a>
                    <Place style={style.icon} onClick={() => this.setState({showHours: !this.state.showHours})}/>
                    {selectedRestaurant.address}
                </h4>
                {/*<h3 style={style.heading}>Hours</h3>*/}
                {/*<ul>*/}
                    {/*{h}*/}
                {/*</ul>*/}
                <Table>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn>Hours</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {h}
                    </TableBody>
                </Table>
            </div>
        )
    }
}

export default BusinessDetails;