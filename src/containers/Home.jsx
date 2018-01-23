import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Col, Row } from 'react-grid-system';
import MainStore from '../stores/MainStore';
import {generateUniqueKey, formatDate} from '../util/utils';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import { blue200, red200, pink900, white, greenA700 } from 'material-ui/styles/colors';
import Warning from 'material-ui/svg-icons/alert/warning';

@observer
class Home extends Component {

    componentDidMount() {
        MainStore.getPublicHealthInspectionData();
    }

    paginate = (array, pageSize, page) => {
        --page;
        return array.slice(0, (page + 1) * pageSize);
    };

    loadMore = (page) => {
        MainStore.setPaginationPageNumber(page);
    };

    render() {

        const styles = {
            loader: {position: 'fixed', top: 0, left: 0, bottom: 0, right: 0, margin: 'auto'},
            nestedListItems: {padding: 0},
        };

        let {
            dateRange,
            loading,
            pageNumber,
            paginationLoading,
            restaurants,
            restaurantsSearchResults,
        } = MainStore;

        restaurants = restaurantsSearchResults ? restaurantsSearchResults : restaurants;

        // restaurants.sort((a,b) => { //Array now becomes [41, 25, 8, 7]
        //     return b.violations.length - a.violations.length
        // });

        return (
                <Row>
                    <Col key={generateUniqueKey()} md={12} >
                        {
                            loading
                            ? <CircularProgress size={100} thickness={5} color={greenA700} style={styles.loader}/>
                            : <Paper zDepth={2}>
                                {
                                    this.paginate(restaurants, 50, pageNumber).map((r) => {
                                            {/*let totalPoints = r.violations.reduce((a,b) => a + b.violation_points, 0);*/} //Todo remove if not using
                                            let violationText = r.violations.length > 1 ? 'violations' : 'violation';
                                            return (
                                                    <List key={generateUniqueKey()} style={{padding: 0}}>
                                                        <ListItem key={generateUniqueKey()}
                                                                  primaryText={r.name}
                                                                  secondaryText={`${r.violations.length} ${violationText} since ${formatDate(dateRange)}`}
                                                                  leftIcon={<Warning color={!r.violations.some(r => r.violation_type === 'red') ? blue200 : red200 }/>}
                                                                  primaryTogglesNestedList={true}
                                                                  nestedListStyle={styles.nestedListItems}
                                                                  nestedItems={
                                                                      r.violations.length > 0 && r.violations.map((v) => {
                                                                          return <ListItem
                                                                              key={generateUniqueKey()}
                                                                              hoverColor={v.violation_type === 'blue' ? blue200 : red200}
                                                                              primaryText={`${v.violation_type.toUpperCase()} - ${v.violation_points} points`}
                                                                              secondaryText={
                                                                                  <span>
                                                                                      <span>{`Noncompliant: ${v.violation_description}`}</span><br/>
                                                                                      {`${formatDate(v.violation_date)}`}
                                                                                  </span>
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
                                        backgroundColor={pink900}
                                        label={paginationLoading ? "Loading..." : "Load More"}
                                        labelStyle={{color: white}}
                                        disabled={!!paginationLoading}
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