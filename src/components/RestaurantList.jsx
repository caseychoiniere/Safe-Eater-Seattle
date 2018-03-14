import React, { Component } from 'react';
import { observer } from 'mobx-react';
import MainStore from '../stores/MainStore';
import { generateUniqueKey, formatDate } from '../util/utils';
import { blue300, grey300, orange300, red300, red500, pink900, white, green300, greenA700 } from 'material-ui/styles/colors';
import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import ArrowDropUp from 'material-ui/svg-icons/navigation/arrow-drop-up';
import CircularProgress from 'material-ui/CircularProgress';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import { List, ListItem } from 'material-ui/List';
import Mood from 'material-ui/svg-icons/social/mood';
import MoodBad from 'material-ui/svg-icons/social/mood-bad';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import SentimentNeutral from 'material-ui/svg-icons/social/sentiment-neutral';
import SentimentSatisfied from 'material-ui/svg-icons/social/sentiment-satisfied';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import Warning from 'material-ui/svg-icons/alert/warning';

@observer
class RestaurantList extends Component {

    getRestaurantInfo = (restaurant) => {
        const { selectedRestaurant, showInfoWindow} = MainStore;
        if((selectedRestaurant && selectedRestaurant.id !== restaurant.id) || selectedRestaurant === null) MainStore.getRestaurantData(restaurant);
        if(!showInfoWindow) MainStore.toggleInfowindow();
    };

    generateIcon = (violations, closed, nestedIcon, nestedViolation) => {
        const style = {
            button: { width: 36, height: 36, padding: 0, top: 6, left: 0 },
            icon: { width: 36, height: 36 },
            smallIcon: {top: 18}
        };
        let points = violations.reduce((a,b) => { return a + b.violation_points} ,0);

        if(!nestedIcon) {
            if(closed) {
                return <IconButton tooltip='This establishment was closed at least once in the past 12 months due to poor inspection results'
                                   tooltipPosition='bottom-right'
                                   touch={true}
                                   style={style.button}
                                   iconStyle={style.icon}
                >
                    <Warning color={ red500 }/>
                </IconButton>
            }
            if(!closed && points >= 85) {
                return <IconButton tooltip='85 or more violation points in the past 12 months'
                                   tooltipPosition='bottom-right'
                                   touch={true}
                                   style={style.button}
                                   iconStyle={style.icon}
                >
                    <MoodBad color={ red300 }/>
                </IconButton>
            }
            if(!closed && points < 85 && points >= 65) {
                return <IconButton tooltip='Between 85 and 65 violation points in the past 12 months'
                                   tooltipPosition='bottom-right'
                                   touch={true}
                                   style={style.button}
                                   iconStyle={style.icon}
                >
                    <SentimentNeutral color={ orange300 }/>
                </IconButton>
            }
            if(!closed && points < 65 && points >= 45) {
                return <IconButton tooltip='Between 65 and 45 violation points in the past 12 months'
                                   tooltipPosition='bottom-right'
                                   touch={true}
                                   style={style.button}
                                   iconStyle={style.icon}
                >
                    <SentimentSatisfied color={ blue300 }/>
                </IconButton>
            }
            if(!closed && points < 45) {
                return <IconButton tooltip='Less than 45 violation points in the past 12 months'
                            tooltipPosition='bottom-right'
                            touch={true}
                            style={style.button}
                            iconStyle={style.icon}
                >
                    <Mood style={style.smallIcon} color={green300}/>
                </IconButton>
            }
        } else {
            if(nestedViolation !== 'no violations') {
                return <Warning style={style.smallIcon} color={nestedViolation === 'blue' ? blue300 : red300}/>
            } else {
                return <ThumbUp style={style.smallIcon} color={green300}/>
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
                                this.paginate(restaurants, 50, pageNumber).map((r) => {
                                    let violationText = r.violations.length > 1 ? 'violations' : 'violation';
                                    return (
                                        <List key={generateUniqueKey()} style={{padding: 0}}>
                                            <ListItem key={generateUniqueKey()}
                                                      style={selectedRestaurant && selectedRestaurant.id === r.id ? {backgroundColor: grey300} : {}}
                                                      primaryText={r.name}
                                                      secondaryText={`${r.violations.length} ${violationText} since ${formatDate(dateRange)}`}
                                                      leftIcon={this.generateIcon(r.violations, r.inspection_closed_business, false, null)}
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
                                                                  leftIcon={this.generateIcon(r.violations, false, true, v.violation_type)}
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
                    { restaurants.length > 50 &&
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