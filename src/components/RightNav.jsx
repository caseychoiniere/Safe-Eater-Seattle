import React, { Component } from 'react';
import { observer } from 'mobx-react';
import MainStore from '../stores/MainStore';
import {green600} from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

@observer
class RightNav extends Component {

    toggleNav = () => { MainStore.toggleNav() };

    render() {
        const { openNav } = MainStore;
        return (
            <div>
                <Drawer
                    docked={false}
                    open={openNav}
                    onRequestChange={this.toggleNav}
                    openSecondary={true}
                >
                    <AppBar style={{backgroundColor: green600}} iconElementLeft={<IconButton><NavigationClose onClick={this.toggleNav}/></IconButton>}/>
                    <MenuItem  style={{marginTop: 64}} onClick={this.toggleNav}>Menu Item</MenuItem>
                    <MenuItem onClick={this.toggleNav}>Menu Item 2</MenuItem>
                </Drawer>
            </div>
        );
    }
}

export default RightNav;