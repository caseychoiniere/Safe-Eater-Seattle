import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Col, Row } from 'react-grid-system';
import MainStore from '../stores/MainStore'
import {generateUniqueKey, formatDate} from '../util/utils'
import Divider from 'material-ui/Divider'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import {List, ListItem} from 'material-ui/List';
import { blue200, red200 } from 'material-ui/styles/colors';
import Warning from 'material-ui/svg-icons/alert/warning';

@observer
class Home extends Component {
    componentDidMount() {
        MainStore.getPublicHealthInspectionData();
    }

    paginate = (array, pageSize, page) => {
        --page;
        if(array.length >= page * pageSize) { // Todo: fix this pagination
            // MainStore.showPaginationButton();
            return array.slice(0, (page + 1) * pageSize);
        } else {
            // MainStore.showPaginationButton();
            return array.slice(0, (page + 1) * pageSize);
        }
    };

    loadMore = (page) => {
        MainStore.setPaginationPageNumber(page);
    };

    render() {
        let {
            dateRange,
            loading,
            pageNumber,
            paginationLoading,
            restaurants,
            restaurantsSearchResults,
            showPagination//Todo: remove showPagination if not used
        } = MainStore;
        restaurants = restaurantsSearchResults ? restaurantsSearchResults : restaurants;

        return (
                <Row>
                    <Col key={generateUniqueKey()} md={12} >
                        {
                            loading
                            ? <CircularProgress size={100} thickness={5} style={{position: 'fixed', top: '45%', left: '47%'}}/>
                            : <Paper zDepth={2}>
                                {
                                    this.paginate(restaurants, 250, pageNumber).map((r) => {
                                        let totalPoints = r.violations.reduce((a,b) => a + b.violation_points, 0);
                                        return (
                                                <List key={generateUniqueKey()} style={{padding: 0}}>
                                                    <ListItem key={generateUniqueKey()}
                                                              primaryText={r.name}
                                                              secondaryText={`${totalPoints} total violation points since ${formatDate(dateRange)}`}
                                                              leftIcon={<Warning color={!r.violations.some(r => r.violation_type === 'red') ? blue200 : red200 }/>}
                                                              primaryTogglesNestedList={true}
                                                              nestedListStyle={{padding: 0}}
                                                              nestedItems={
                                                                  r.violations.length > 0 && r.violations.map((v) => {
                                                                      return <ListItem
                                                                          key={generateUniqueKey()}
                                                                          hoverColor={v.violation_type === 'blue' ? blue200 : red200}
                                                                          primaryText={`Violation type: ${v.violation_type.toUpperCase()} - ${v.violation_points} points`}
                                                                          secondaryText={
                                                                              <p>
                                                                                  <span>{`Noncompliant: ${v.violation_description}`}</span><br />
                                                                                  {`Violation date: ${formatDate(v.violation_date)}`}
                                                                              </p>
                                                                          }
                                                                          secondaryTextLines={2}
                                                                      />
                                                                  })
                                                              }
                                                    />
                                                    <Divider/>
                                                </List>
                                        )
                                    })
                                }
                                { restaurants.length > 250 &&
                                    <RaisedButton
                                        label={paginationLoading ? "Loading..." : "Load More"}
                                        secondary={true}
                                        disabled={!!loading}
                                        onClick={()=>this.loadMore(pageNumber)}
                                        fullWidth={true}
                                    />
                                }
                            </Paper>
                        }
                    </Col>
                </Row>
        );
    }
}

export default Home;