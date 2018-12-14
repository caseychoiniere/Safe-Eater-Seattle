import React, { Component } from 'react';
import { observer } from 'mobx-react';
import MainStore from '../stores/MainStore';
import { debounce } from '../util/utils'
import { grey50, pink900 } from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import Search from 'material-ui/svg-icons/action/search';
import Close from 'material-ui/svg-icons/navigation/close';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

@observer
class SearchBar extends Component {

    componentDidMount() {
        if (this.refs.searchInput) { // Check if searchInput is in DOM and focus
            let search = this.refs.searchInput ? this.refs.searchInput : null;
            if(MainStore.showSearch && search !== null) {
                search.focus();
                search.select();
            }
        }
        this.search = debounce(this.search , 300);
    }

    render() {

        const styles = {
            searchBar: {
                backgroundColor: grey50,
                position: 'fixed',
                zIndex: 1500,
                width: '100%',
                display: 'flex',
                height: 64,
                hintText: {
                    fontWeight: 100
                },
                closeSearchIcon: {
                    position: 'absolute',
                    right: 10,
                    top: 8,
                    zIndex: 9999
                },
                searchIcon: {
                    position: 'absolute',
                    left: 8,
                    top: 8,
                    zIndex: 9999
                },
                searchLoading: {
                    position: 'absolute',
                    left: 20,
                    top: 20,
                    zIndex: 9999
                },
                textField: {
                    width: '80%',
                    position: 'absolute',
                    top: 8,
                    left: 60
                },
                textFieldUnderline: {
                    display: 'none'
                }
            }
        };

        const { searchLoading, showSearch } = MainStore;

        return (showSearch ? <Paper className="navbar" style={styles.searchBar} zDepth={2}>
            {!searchLoading ?
                <IconButton style={styles.searchBar.searchIcon}>
                    <Search onClick={()=>this.search()}/>
                </IconButton> :
                <CircularProgress size={24} thickness={2} color={pink900} style={styles.searchBar.searchLoading}/>}
            <TextField
                ref="searchInput"
                hintText="Search (name, zipcode, address etc.)"
                hintStyle={styles.searchBar.hintText}
                onKeyUp={() => this.search()}
                style={styles.searchBar.textField}
                underlineStyle={styles.searchBar.textFieldUnderline}
                underlineFocusStyle={styles.searchBar.textFieldUnderline} />
            <IconButton style={styles.searchBar.closeSearchIcon}>
                <Close onClick={()=>this.showSearch()}/>
            </IconButton>
        </Paper> : null)
    }

    search() {
        let query = this.refs.searchInput.getValue();
        MainStore.search(query);
    }

    showSearch() {
        MainStore.resetSearchResults();
        MainStore.toggleSearch();
    }
}

export default SearchBar;

