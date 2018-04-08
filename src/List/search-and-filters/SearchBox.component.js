/* eslint-disable no-unused-expressions */
import React from 'react';
import Translate from 'd2-ui/lib/i18n/Translate.mixin';
import TextField from 'material-ui/TextField/TextField';

import { currentSubSection$ } from '../../App/appStateStore';
import ObservedEvents from '../../utils/ObservedEvents.mixin';

const unsearchableSections = [
    'organisationUnit',
];

const SearchBox = React.createClass({
    propTypes: {
        searchObserverHandler: React.PropTypes.func.isRequired,
    },

    mixins: [ObservedEvents, Translate],

    getInitialState() {
        return {
            showSearchField: false,
            value: '',
        };
    },

    componentWillMount() {
        this.searchBoxCb = this.createEventObserver('searchBox');
    },

    componentDidMount() {
        const searchObserver = this.events.searchBox
            .debounceTime(400)
            .map(event =>
                (event && event.target && event.target.value
                    ? event.target.value
                    : ''
                ))
            .distinctUntilChanged();

        this.props.searchObserverHandler(searchObserver);

        this.subscription = currentSubSection$
            .subscribe(currentSection => this.setState({
                value: '',
                showSearchField: !unsearchableSections.includes(currentSection),
            }));
    },

    componentWillUnmount() {
        this.subscription && this.subscription.unsubscribe && this.subscription.unsubscribe();
    },

    onKeyUp(event) {
        this.setState({
            value: event.target.value,
        });
        this.searchBoxCb(event);
    },

    render() {
        const style = {
            display: 'inline-block',
            marginRight: 16,
            position: 'relative',
            top: -15,
        };
        return !!this.state.showSearchField &&
            (<div className="search-list-items" style={style}>
                <TextField
                    className="list-search-field"
                    value={this.state.value}
                    fullWidth={false}
                    type="search"
                    onChange={this.onKeyUp}
                    floatingLabelText={`${this.getTranslation('search_by_name')}`}
                />
            </div>);
    },
});

export default SearchBox;
