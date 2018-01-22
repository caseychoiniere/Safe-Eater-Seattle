import React, { Component } from 'react';
import { observer } from 'mobx-react';
import MainStore from '../stores/MainStore'
import SearchBar from './SearchBar.jsx'
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import Menu from 'material-ui/svg-icons/navigation/menu';
import Search from 'material-ui/svg-icons/action/search';

@observer
class Header extends Component {

    toggleNav = () => MainStore.toggleNav();

    toggleSearch = () => MainStore.toggleSearch();

    render() {
        const { showSearch } = MainStore;
        return (
            showSearch ? <SearchBar /> :
                <AppBar
                    iconElementLeft={<IconButton><Menu onClick={this.toggleNav}/></IconButton>}
                    iconElementRight={<IconButton><Search onClick={this.toggleSearch}/></IconButton>}
                    style={{position: 'fixed'}}
                />
        );
    }
}

export default Header;