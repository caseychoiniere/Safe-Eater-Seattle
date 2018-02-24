import React, {Component} from 'react';
import { observer } from 'mobx-react';
import { Col } from 'react-grid-system';
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
        super();
        this.state = {
            showHours: false
        }
    }

    render() {
        const style = {
            closeBtn: { float: 'left', margin: '0px 0px 0px 6px' },
            heading: {margin: '8px', fontWeight: 100},
            mapTitle: { textAlign: 'center', margin: '14px 12%' },
            icon: { verticalAlign: 'bottom' },
            tableHeaderColumn: {fontSize: 16, color: 'black', paddingLeft: 4},
            tableRowColumn: {paddingLeft: 4},
            tableWrapper: {padding: '14px 10px 70px'},
            tick: {fontSize: 12}
        };

        let { hours, selectedRestaurant } = MainStore;

        const day = hours.map((d) => {
            return (
                <TableRow key={generateUniqueKey()}>
                    <TableRowColumn style={style.tableRowColumn}>{d}</TableRowColumn>
                </TableRow>
            )
        });

        return (
            <Col md={12}>
                <h4 style={style.heading}>
                    <Phone style={style.icon} />
                    {selectedRestaurant.phone}
                </h4>
                <h4 style={style.heading}>
                    <Place style={style.icon} onClick={() => this.setState({showHours: !this.state.showHours})}/>
                    {selectedRestaurant.address}
                </h4>
                { hours.length ? <div style={style.tableWrapper}>
                    <Table>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn style={style.tableHeaderColumn}>Hours</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {day}
                        </TableBody>
                    </Table>
                </div> : null}
            </Col>
        )
    }
}

export default BusinessDetails;