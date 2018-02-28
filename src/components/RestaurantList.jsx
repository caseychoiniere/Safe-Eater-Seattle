import React, { Component } from 'react';
import { observer } from 'mobx-react';
import MainStore from '../stores/MainStore';
import { generateUniqueKey, formatDate } from '../util/utils';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import SentimentVeryDissatisfied from 'material-ui/svg-icons/social/sentiment-very-dissatisfied';
import SentimentNeutral from 'material-ui/svg-icons/social/sentiment-neutral';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem } from 'material-ui/List';
import { blue200, red200, pink900, white, greenA700 } from 'material-ui/styles/colors';
import Warning from 'material-ui/svg-icons/alert/warning';

@observer
class RestaurantList extends Component {

    getRestaurantInfo = (restaurant) => {
        const { selectedRestaurant, showInfoWindow} = MainStore;
        if((selectedRestaurant && selectedRestaurant.id !== restaurant.id) || selectedRestaurant === null) MainStore.getRestaurantData(restaurant);
        MainStore.toggleNestedList(restaurant.id);
        if(!showInfoWindow) MainStore.toggleInfowindow(); //Todo: make change to this so that the details view doesn't open again if just closing list item on mobile
    };

    generateIcon = (violations) => {
        const style = {
            button: { width: 36, height: 36, padding: 0, top: 6, left: 0 },
            icon: { width: 36, height: 36 }
        };
        if(violations.some(r => r.violation_type === 'red')) {
            return <IconButton tooltip='At least one critical violation in the past 12 months'
                               tooltipPosition='bottom-right'
                               touch={true}
                               style={style.button}
                               iconStyle={style.icon}
            >
                <SentimentVeryDissatisfied color={ red200 }/>
            </IconButton>
        } else {
            return <IconButton tooltip='No critical violations in the past 12 months'
                               tooltipPosition='bottom-right'
                               touch={true}
                               style={style.button}
                               iconStyle={style.icon}
            >
                <SentimentNeutral color={ blue200 }/>
            </IconButton>
        }
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
        const style = {
            loader: {position: 'fixed', top: 0, left: 0, bottom: 0, right: 0, margin: 'auto'},
            nestedListItems: {padding: 0},
            smallIcon: {top: 18}
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
                loading ? <CircularProgress size={100} thickness={5} color={greenA700} style={style.loader}/>
                        : <Paper zDepth={2}>
                            {
                                this.paginate(restaurants, 50, pageNumber).map((r) => {
                                    let violationText = r.violations.length > 1 ? 'violations' : 'violation';
                                    return (
                                        <List key={generateUniqueKey()} style={{padding: 0}}>
                                            <ListItem key={generateUniqueKey()}
                                                      primaryText={r.name}
                                                      secondaryText={`${r.violations.length} ${violationText} since ${formatDate(dateRange)}`}
                                                      leftIcon={this.generateIcon(r.violations)}
                                                      nestedListStyle={style.nestedListItems}
                                                      onClick={() => this.getRestaurantInfo(r)}
                                                      open={openNestedListItems.has(r.id)}
                                                      rightIconButton={<IconButton onClick={() => this.toggleNestedList(r.id)}><ArrowDropDown/></IconButton>}
                                                      nestedItems={
                                                          r.violations.length > 0 && r.violations.map((v) => {
                                                              return <ListItem
                                                                  key={generateUniqueKey()}
                                                                  disabled={true}
                                                                  leftIcon={<Warning style={style.smallIcon} color={v.violation_type === 'blue' ? blue200 : red200}/>}
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