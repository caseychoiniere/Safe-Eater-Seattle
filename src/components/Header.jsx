import React, { Component } from 'react';
import { observer } from 'mobx-react';
import MainStore from '../stores/MainStore';
import logo from '../images/logo.png';
import SearchBar from './SearchBar.jsx'
import SocialSharing from './SocialSharing.jsx'
import { green700 } from 'material-ui/styles/colors';
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

    iconMenu = () => {
      return <IconMenu
          iconButtonElement={<IconButton><MoreVertIcon color={'#fff'}/></IconButton>}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}>
          <MenuItem primaryText="About" onClick={() => this.toggleModal('about')}/>
          <MenuItem primaryText="Contact Us" onClick={() => this.contactUs()}/>
          <MenuItem primaryText="Terms of Use" onClick={() => this.toggleModal('terms')}/>
      </IconMenu>;
    };

    render() {
        const { showSearch } = MainStore;
        const style = {
            appBar: {position: 'fixed', backgroundColor: green700},
            logo: {maxWidth: 64, position: 'absolute', top: 10, left: 60}
        };

        return (
            showSearch ? <SearchBar /> :
                <div>
                    <AppBar
                        iconElementLeft={<span>
                            <IconButton>
                                <Search onClick={this.toggleSearch} color={'#fff'}/>
                            </IconButton>
                            <img src={logo} alt="lemon" style={style.logo}/>
                        </span>}
                        iconElementRight={<span>
                                            <SocialSharing />
                                            {this.iconMenu()}
                                          </span>}
                        style={style.appBar}
                    />
                </div>
        );
    }
}

export default Header;