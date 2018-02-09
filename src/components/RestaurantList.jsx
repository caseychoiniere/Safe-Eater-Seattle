import React, { Component } from 'react';
import { observer } from 'mobx-react';
import MainStore from '../stores/MainStore';
import {generateUniqueKey, formatDate} from '../util/utils';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import { blue200, red200, pink900, white, greenA700 } from 'material-ui/styles/colors';
import Warning from 'material-ui/svg-icons/alert/warning';

@observer
class RestaurantList extends Component {

    componentDidMount() {
        // MainStore.getPublicHealthInspectionData(); //Todo: Should this go in Home.jsx?????????
    }

    getRestaurantInfo = (restaurant) => {
        const { selectedRestaurant, showInfoWindow} = MainStore;
        if(selectedRestaurant && selectedRestaurant.id !== restaurant.id || selectedRestaurant === null) MainStore.getRestaurantInfo(restaurant);
        MainStore.toggleNestedList(restaurant.id);
        if(!showInfoWindow) MainStore.toggleInfowindow();
    };

    loadMore = (page) => {
        MainStore.setPaginationPageNumber(page);
    };

    paginate = (array, pageSize, page) => {
        --page;
        return array.slice(0, (page + 1) * pageSize);
    };

    toggleNestedList = (id) => {
        MainStore.toggleNestedList(id);
    };


    render() {
        const slideContent = () => {
            let padding;
            if(!!document.getElementById('mc1') ) padding = document.getElementById('mc1').offsetLeft;
            return {paddingLeft: window.innerWidth <= 720 ? 0 : padding > 410 ? 410 : 410 - padding};
        };

        const styles = {
            loader: {position: 'fixed', top: 0, left: 0, bottom: 0, right: 0, margin: 'auto'},
            nestedListItems: {padding: 0},
            mainCol: slideContent()
        };

        let {
            dateRange,
            loading,
            openNestedListItems,
            pageNumber,
            paginationLoading,
            restaurants,
            restaurantsSearchResults,
        } = MainStore;

        restaurants = restaurantsSearchResults ? restaurantsSearchResults : restaurants;

        return (
                loading ? <CircularProgress size={100} thickness={5} color={greenA700} style={styles.loader}/>
                        : <Paper zDepth={2}>
                            {
                                this.paginate(restaurants, 50, pageNumber).map((r) => {
                                    let violationText = r.violations.length > 1 ? 'violations' : 'violation';
                                    return (
                                        <List key={generateUniqueKey()} style={{padding: 0}}>
                                            <ListItem key={generateUniqueKey()}
                                                      primaryText={r.name}
                                                      secondaryText={`${r.violations.length} ${violationText} since ${formatDate(dateRange)}`}
                                                      leftIcon={<Warning color={!r.violations.some(r => r.violation_type === 'red') ? blue200 : red200 }/>}
                                                      nestedListStyle={styles.nestedListItems}
                                                      onClick={() => this.getRestaurantInfo(r)}
                                                      open={openNestedListItems.has(r.id)}
                                                      rightIconButton={<IconButton onClick={() => this.toggleNestedList(r.id)}><ArrowDropDown/></IconButton>}
                                                      // primaryTogglesNestedList={true}
                                                      nestedItems={
                                                          r.violations.length > 0 && r.violations.map((v) => {
                                                              return <ListItem
                                                                  key={generateUniqueKey()}
                                                                  hoverColor={v.violation_type === 'blue' ? blue200 : red200}
                                                                  primaryText={`${v.violation_type.toUpperCase()} - ${v.violation_points} points`}
                                                                  secondaryText={
                                                                      <span>
                                                                          <span>{`Noncompliant: ${v.violation_description}`}</span><br/>
                                                                             {v.violation_date}
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

        );
    }
}

export default RestaurantList;