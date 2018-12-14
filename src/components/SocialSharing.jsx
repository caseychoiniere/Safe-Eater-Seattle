import React, { Component } from 'react';
import { observer } from 'mobx-react';
import MainStore from '../stores/MainStore'
import { green300, green700 } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import Share from 'material-ui/svg-icons/social/share';
import {
    FacebookShareButton,
    FacebookIcon,
    RedditShareButton,
    RedditIcon,
    TwitterShareButton,
    TwitterIcon} from 'react-share';

@observer
class SocialSharing extends Component {

    toggleSharing = () => MainStore.toggleSharing();

    getRightPosition = (el) => {
        if(el === 'fb') return 105;
        if(el === 'tw') return 148;
        if(el === 'gp') return 193;
    };

    getIconCss = (btn, el) => {
        if(btn === 'share') {
            return {
                position: 'absolute',
                top: 16,
                right: this.getRightPosition(el),
                cursor: 'pointer',
                zIndex: 2000,
                boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
                borderRadius: '50%'
            }
        } else {
            return {
                position: 'absolute',
                top: 8,
                right: 46,
                zIndex: 2000,
                backgroundColor: MainStore.showSharingIcons ? green300 : green700,
                borderRadius: '50%'
            }
        }
    };

    render() {
        const { showSharingIcons } = MainStore;
        const shareQuote = `Eat Safe Seattle let's you see food safety inspection results and trends from food establishments around Seattle`;
        const shareUrl = `http://www.eatsafeseattle.com`;

        return (
                <div>
                    <IconButton style={this.getIconCss()} onClick={() => this.toggleSharing()}>
                        {!showSharingIcons ? <Share color={'#fff'}/> : <ArrowForward color={'#fff'}/>}
                    </IconButton>
                    {showSharingIcons &&
                    <span>
                            <FacebookShareButton
                                url={shareUrl}
                                quote={shareQuote}
                                style={this.getIconCss('share','fb')}
                            >
                                <FacebookIcon size={32} round />
                            </FacebookShareButton>
                            <TwitterShareButton
                                url={shareUrl}
                                quote={shareQuote}
                                style={this.getIconCss('share','tw')}
                            >
                                <TwitterIcon size={32} round />
                            </TwitterShareButton>
                            <RedditShareButton
                                url={shareUrl}
                                style={this.getIconCss('share','gp')}
                            >
                                <RedditIcon size={32} round />
                            </RedditShareButton>
                        </span>
                    }
                </div>
        );
    }
}

export default SocialSharing;