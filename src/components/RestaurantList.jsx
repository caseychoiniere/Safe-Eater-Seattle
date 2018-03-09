import React, { Component } from 'react';
import { observer } from 'mobx-react';
import MainStore from '../stores/MainStore';
import { generateUniqueKey, formatDate } from '../util/utils';
import { blue200, grey300, red200, pink900, white, green200, greenA700 } from 'material-ui/styles/colors';
import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import ArrowDropUp from 'material-ui/svg-icons/navigation/arrow-drop-up';
import CircularProgress from 'material-ui/CircularProgress';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import { List, ListItem } from 'material-ui/List';
import MoodBad from 'material-ui/svg-icons/social/mood-bad';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import SentimentNeutral from 'material-ui/svg-icons/social/sentiment-neutral';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import Warning from 'material-ui/svg-icons/alert/warning';

@observer
class RestaurantList extends Component {

    getRestaurantInfo = (restaurant) => {
        const { selectedRestaurant, showInfoWindow} = MainStore;
        if((selectedRestaurant && selectedRestaurant.id !== restaurant.id) || selectedRestaurant === null) MainStore.getRestaurantData(restaurant);
        if(!showInfoWindow) MainStore.toggleInfowindow();
    };

    generateIcon = (violations, nestedIcon, nestedViolation) => {
        const style = {
            button: { width: 36, height: 36, padding: 0, top: 6, left: 0 },
            icon: { width: 36, height: 36 },
            smallIcon: {top: 18}
        };

        if(!nestedIcon) {
            if (violations.some(r => r.violation_type === 'red')) {
                return <IconButton tooltip='At least one critical violation in the past 12 months'
                                   tooltipPosition='bottom-right'
                                   touch={true}
                                   style={style.button}
                                   iconStyle={style.icon}
                >
                    <MoodBad color={ red200 }/>
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
        } else {
            if(nestedViolation !== 'no violations') {
                return <Warning style={style.smallIcon} color={nestedViolation === 'blue' ? blue200 : red200}/>
            } else {
                return <ThumbUp style={style.smallIcon} color={green200}/>
            }
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
            selectedRestaurant
        } = MainStore;

        restaurants = restaurantsSearchResults ? restaurantsSearchResults : restaurants;

        return (
                loading ? <CircularProgress size={100} thickness={5} color={greenA700} style={style.loader}/>
                        : <Paper zDepth={2}>
                            {
                                this.paginate(restaurants, 25, pageNumber).map((r) => {
                                    let violationText = r.violations.length > 1 ? 'violations' : 'violation';
                                    return (
                                        <List key={generateUniqueKey()} style={{padding: 0}}>
                                            <ListItem key={generateUniqueKey()}
                                                      style={selectedRestaurant && selectedRestaurant.id === r.id ? {backgroundColor: grey300} : {}}
                                                      primaryText={r.name}
                                                      secondaryText={`${r.violations.length} ${violationText} since ${formatDate(dateRange)}`}
                                                      leftIcon={this.generateIcon(r.violations, false, null)}
                                                      nestedListStyle={style.nestedListItems}
                                                      onClick={() => this.getRestaurantInfo(r)}
                                                      open={openNestedListItems.has(r.id)}
                                                      rightIconButton={
                                                          <IconButton onClick={() => this.toggleNestedList(r.id)}>
                                                              {openNestedListItems.has(r.id) ? <ArrowDropUp/> : <ArrowDropDown/>}
                                                          </IconButton>
                                                      }
                                                      nestedItems={ openNestedListItems.has(r.id) ?
                                                          r.violations.length > 0 && r.violations.map((v) => {
                                                              return <ListItem
                                                                  key={generateUniqueKey()}
                                                                  disabled={true}
                                                                  leftIcon={this.generateIcon(r.violations, true, v.violation_type)}
                                                                  primaryText={`${v.violation_type.toUpperCase()} - ${v.violation_points} points`}
                                                                  secondaryText={
                                                                      <span>
                                                                          <span>
                                                                              {v.violation_description.length ? 'Noncompliant:' : 'Compliant! No violations!'}
                                                                              {`${v.violation_description}`}
                                                                          </span><br/>
                                                                             {v.violation_date}
                                                                      </span>
                                                                  }
                                                                  secondaryTextLines={2}
                                                              />
                                                          }) : []
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