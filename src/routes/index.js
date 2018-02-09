import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'react-grid-system';
import Map from '../components/Map.jsx';
import Header from '../components/Header';
import Home from '../containers/Home.jsx';
import RightNav from '../components/RightNav.jsx';

export default () => (
    <Router>
        <div>
            <Route component={Header} />
            <Route component={RightNav} />
            <Container fluid className="mainContainer" id="mc1">
                <Switch>
                    <Route  path='/map/:id' component={Map} />
                    <Route exact path='/' component={Home} />
                </Switch>
            </Container>
        </div>
    </Router>
);