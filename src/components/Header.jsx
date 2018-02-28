import React, { Component } from 'react';
import { observer } from 'mobx-react';
import MainStore from '../stores/MainStore'
import SearchBar from './SearchBar.jsx'
import {green700} from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Search from 'material-ui/svg-icons/action/search';

@observer
class Header extends Component {

    toggleModal = (modal) => MainStore.toggleModal(modal);

    toggleSearch = () => MainStore.toggleSearch();

    contactUs = () => {
        window.location.href = "mailto:user@example.com";
    };

    render() {
        const { showSearch } = MainStore;
        return (
            showSearch ? <SearchBar /> :
                <AppBar
                    iconElementLeft={<IconButton><Search onClick={this.toggleSearch}/></IconButton>}
                    iconElementRight={<IconMenu iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                                                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                                targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                                                <MenuItem primaryText="About" onClick={() => this.toggleModal('about')}/>
                                                <MenuItem primaryText="Contact Us" onClick={() => this.contactUs()}/>
                                                <MenuItem primaryText="Terms of Use" onClick={() => this.toggleModal('terms')}/>
                                      </IconMenu>}
                    style={{position: 'fixed', backgroundColor: green700}}
                />
        );
    }
}

export default Header;