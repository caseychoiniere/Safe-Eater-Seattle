import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'react-grid-system';
import Header from '../components/Header';
import Home from '../containers/Home.jsx';

export default () => (
    <Router>
        <div>
            <Route component={Header} />
            <Container fluid className="mainContainer" id="mc1">
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Redirect to="/" />
                </Switch>
            </Container>
        </div>
    </Router>
);