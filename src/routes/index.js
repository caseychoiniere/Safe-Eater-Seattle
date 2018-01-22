import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'react-grid-system';
import Map from '../containers/Map.jsx';
import Header from '../components/Header';
import Home from '../containers/Home.jsx';
import LeftNav from '../components/LeftNav.jsx';

export default () => (
    <Router>
        <div>
            <Route component={Header} />
            <Route component={LeftNav} />
            <Container fluid className="mainContainer">
                <Switch>
                    <Route  path='/map/:id' component={Map} />
                    <Route exact path='/' component={Home} />
                </Switch>
            </Container>
        </div>
    </Router>
);