import React, {Component} from 'react';
import {observer} from 'mobx-react';
import MainStore from '../stores/MainStore';
import {generateUniqueKey, formatDate} from '../util/utils';
import {
  blue300,
  grey300,
  orange300,
  red300,
  red500,
  pink900,
  white,
  green300,
  greenA700
} from 'material-ui/styles/colors';
import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import ArrowDropUp from 'material-ui/svg-icons/navigation/arrow-drop-up';
import CircularProgress from 'material-ui/CircularProgress';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
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
  getRestaurantInfo = restaurant => {
    const {
      selectedRestaurant,
      showInfoWindow
    } = MainStore;


    if (
        selectedRestaurant === null ||
        selectedRestaurant.id !== restaurant.id
    ) {
      MainStore.getRestaurantData(restaurant);
    }

    if (!showInfoWindow) {
      MainStore.toggleInfowindow();
    }
  };

  generateIcon = (
      violations,
      closed,
      nestedIcon,
      nestedViolation
  ) => {
    const style = {
      button: {
        width: 36,
        height: 36,
        padding: 0,
        top: 6,
        left: 0
      },
      icon: {
        width: 36,
        height: 36
      },
      smallIcon: {
        top: 18
      }
    };

    const points = violations.reduce(
        (total, violation) => {
          return total + violation.violation_points;
        },
        0
    );

    if (!nestedIcon) {
      if (closed) {
        return (
            <IconButton
                tooltip={
                  'This establishment was closed at least once in the past 12 months due to poor inspection results'
                }
                tooltipPosition="bottom-right"
                touch={true}
                style={style.button}
                iconStyle={style.icon}
            >
              <Warning color={red500}/>
            </IconButton>
        );
      }

      if (!closed && points >= 85) {
        return (
            <IconButton
                tooltip={
                  '85 or more violation points in the past 12 months'
                }
                tooltipPosition="bottom-right"
                touch={true}
                style={style.button}
                iconStyle={style.icon}
            >
              <MoodBad color={red300}/>
            </IconButton>
        );
      }

      if (
          !closed &&
          points < 85 &&
          points >= 65
      ) {
        return (
            <IconButton
                tooltip={
                  'Between 85 and 65 violation points in the past 12 months'
                }
                tooltipPosition="bottom-right"
                touch={true}
                style={style.button}
                iconStyle={style.icon}
            >
              <SentimentNeutral color={orange300}/>
            </IconButton>
        );
      }

      if (
          !closed &&
          points < 65 &&
          points >= 45
      ) {
        return (
            <IconButton
                tooltip={
                  'Between 65 and 45 violation points in the past 12 months'
                }
                tooltipPosition="bottom-right"
                touch={true}
                style={style.button}
                iconStyle={style.icon}
            >
              <SentimentSatisfied color={blue300}/>
            </IconButton>
        );
      }

      if (!closed && points < 45) {
        return (
            <IconButton
                tooltip={
                  'Less than 45 violation points in the past 12 months'
                }
                tooltipPosition="bottom-right"
                touch={true}
                style={style.button}
                iconStyle={style.icon}
            >
              <Mood
                  style={style.smallIcon}
                  color={green300}
              />
            </IconButton>
        );
      }

      return null;
    }

    if (nestedViolation !== 'no violations') {
      return (
          <Warning
              style={style.smallIcon}
              color={
                nestedViolation.toLowerCase() === 'blue'
                    ? blue300
                    : red300
              }
          />
      );
    }

    return (
        <ThumbUp
            style={style.smallIcon}
            color={green300}
        />
    );
  };

  loadMore = () => {
    MainStore.loadMoreRestaurants();
  };

  toggleNestedList = id => {
    MainStore.toggleNestedList(id);
  };

  render() {
    const style = {
      loader: {
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        margin: 'auto'
      },
      nestedListItems: {
        padding: 0
      }
    };

    const {
      dateRange,
      hasMoreRestaurants,
      loading,
      openNestedListItems,
      paginationLoading,
      restaurantsSearchResults,
      selectedRestaurant
    } = MainStore;

    let {restaurants} = MainStore;

    if (restaurantsSearchResults !== null) {
      restaurants = restaurantsSearchResults;
    }

    if (loading) {
      return (
          <CircularProgress
              size={100}
              thickness={5}
              color={greenA700}
              style={style.loader}
          />
      );
    }

    return (
        <Paper zDepth={2}>
          {restaurants.map(restaurant => {
            const violationText =
                restaurant.violations.length === 1
                    ? 'violation'
                    : 'violations';

            return (
                <List
                    key={restaurant.id}
                    style={{padding: 0}}
                >
                  <ListItem
                      style={
                        selectedRestaurant &&
                        selectedRestaurant.id ===
                        restaurant.id
                            ? {
                              backgroundColor:
                              grey300
                            }
                            : {}
                      }
                      primaryText={restaurant.name}
                      secondaryText={
                          `${restaurant.violations.length} ` +
                          `${violationText} since ` +
                          `${formatDate(dateRange)}`
                      }
                      leftIcon={this.generateIcon(
                          restaurant.violations,
                          restaurant.inspection_closed_business,
                          false,
                          null
                      )}
                      nestedListStyle={
                        style.nestedListItems
                      }
                      onClick={() =>
                          this.getRestaurantInfo(
                              restaurant
                          )
                      }
                      open={openNestedListItems.has(
                          restaurant.id
                      )}
                      rightIconButton={
                        <IconButton
                            onClick={event => {
                              event.stopPropagation();

                              this.toggleNestedList(
                                  restaurant.id
                              );
                            }}
                        >
                          {openNestedListItems.has(
                              restaurant.id
                          ) ? (
                              <ArrowDropUp/>
                          ) : (
                              <ArrowDropDown/>
                          )}
                        </IconButton>
                      }
                      nestedItems={
                        openNestedListItems.has(
                            restaurant.id
                        )
                            ? restaurant.violations.map(
                                (
                                    violation,
                                    index
                                ) => {
                                  const violationKey =
                                      [
                                        restaurant.id,
                                        violation.violation_date,
                                        violation.violation_type,
                                        violation.violation_points,
                                        index
                                      ].join('-');

                                  return (
                                      <ListItem
                                          key={
                                            violationKey
                                          }
                                          disabled={
                                            true
                                          }
                                          leftIcon={this.generateIcon(
                                              restaurant.violations,
                                              false,
                                              true,
                                              violation.violation_type
                                          )}
                                          primaryText={
                                              `${violation.violation_type.toUpperCase()} - ` +
                                              `${violation.violation_points} points`
                                          }
                                          secondaryText={
                                            <span>
                                                            <span>
                                                                {violation
                                                                    .violation_description
                                                                    .length
                                                                    ? 'Noncompliant: '
                                                                    : 'Compliant! No violations!'}
                                                              {
                                                                violation.violation_description
                                                              }
                                                            </span>

                                                            <br/>

                                              {
                                                violation.violation_date
                                              }
                                                        </span>
                                          }
                                          secondaryTextLines={
                                            2
                                          }
                                      />
                                  );
                                }
                            )
                            : []
                      }
                  />

                  <Divider/>
                </List>
            );
          })}

          {hasMoreRestaurants &&
              restaurants.length > 0 && (
                  <RaisedButton
                      backgroundColor={pink900}
                      label={
                        paginationLoading
                            ? 'Loading 1,000 more...'
                            : 'Load 1,000 More'
                      }
                      labelStyle={{
                        color: white
                      }}
                      disabled={paginationLoading}
                      onClick={this.loadMore}
                      fullWidth={true}
                  />
              )}
        </Paper>
    );
  }
}

export default RestaurantList;
