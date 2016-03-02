// HelloWorldWidget is an arbitrary name for any "dumb" component. We do not recommend suffixing
// all your dump component names with Widget.

import React, { PropTypes } from 'react';
import _ from 'lodash';

// Simple example of a React "dumb" component
export default class StartButton extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { name } = this.props;
    return (
      <div className="container">
        <span>StartButton</span>
      </div>
    );
  }
}
