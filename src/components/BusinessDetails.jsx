import React, {Component} from 'react';
import { observer } from 'mobx-react';
import { Col } from 'react-grid-system';
import { amber400, grey900 } from 'material-ui/styles/colors';
import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import ArrowDropUp from 'material-ui/svg-icons/navigation/arrow-drop-up';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import Phone from 'material-ui/svg-icons/communication/phone';
import Place from 'material-ui/svg-icons/maps/place';
import Star from 'material-ui/svg-icons/toggle/star';
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

    render() {
        const style = {
            closeBtn: { float: 'left', margin: '0px 0px 0px 6px' },
            heading: {margin: '8px', fontWeight: 100},
            mapTitle: { textAlign: 'center', margin: '14px 12%' },
            icon: { verticalAlign: 'bottom' },
            reviewButton: { marginLeft: 16 },
            reviewCard: { padding: 14, margin: '0px 0px 14px 0px' },
            reviewImage: { float: 'left', padding: '10px 10px 10px 0px', maxWidth: 60 },
            reviewText: { fontSize: '.8em' },
            reviewTime: { fontSize: '.7em' },
            stars: { verticalAlign: 'bottom', marginLeft: -4 },
            tableHeaderColumn: { fontSize: 16, color: 'black', paddingLeft: 4, paddingRight: 0 },
            tableRowColumn: { paddingLeft: 4 },
            tableWrapper: { padding: '0px 10px 10px', overflow: 'none' },
            tick: { fontSize: 12 }
        };

        let { hours, rating, reviews, selectedRestaurant, showReviews } = MainStore;

        const getReviews = () => {
            return reviews.map((r)=> {
                const stars = [...Array(r.rating)].map(n => <Star color={amber400} key={generateUniqueKey()} style={style.stars}/>);
                return <Paper key={r.author_url} style={style.reviewCard} zDepth={1}>
                    <img src={r.profile_photo_url} alt='reviewer avatar' style={style.reviewImage}/>
                    <p>{stars}</p>
                    <p style={style.reviewTime}>{`Review by ${r.author_name} ${r.relative_time_description}`}</p>
                    <p style={style.reviewText}>{r.text}</p>
                </Paper>
            });
        };

        const showReviewList = () => MainStore.toggleReviewList();

        return (
            <Col md={12}>
                <h4 style={style.heading}>
                    <Phone style={style.icon} />
                    {selectedRestaurant.phone}
                </h4>
                <h4 style={style.heading}>
                    <Place style={style.icon} />
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
                            {
                                hours.map((d) => {
                                    return (
                                        <TableRow key={generateUniqueKey()}>
                                            <TableRowColumn style={style.tableRowColumn}>{d}</TableRowColumn>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </div> : null}
                { rating !== null ? <div style={style.tableWrapper}>
                    <Table>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn style={style.tableHeaderColumn}>
                                    Average Rating - {rating}
                                    <FlatButton
                                        label="Recent Reviews"
                                        labelPosition="before"
                                        labelStyle={{color: grey900}}
                                        style={style.reviewButton}
                                        icon={!showReviews ? <ArrowDropDown /> : <ArrowDropUp />}
                                        onClick={() => showReviewList()}
                                    />
                                </TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                    </Table>
                    {showReviews ? getReviews() : null}
                </div> : null}
            </Col>
        )
    }
}

export default BusinessDetails;