import PropTypes from 'prop-types';
import React, { Component } from 'react';

class Footer extends Component {
  static propTypes = {
    expanded: PropTypes.bool.isRequired,
    onExpand: PropTypes.func.isRequired,
  };

  getClassName = () => `material-icons nav-container__expand-icon ${this.props.expanded ? 'rotate-down' : ''}`.trim();

  handleClick = () => {
    this.props.onExpand();
  };

  render() {
    const { expanded } = this.props;
    const toggleButtonPic = !expanded ? '/public/assets/menu-close.svg' : '/public/assets/menu-open.svg';
    return (
      <div className="nav-container__footer" onClick={this.handleClick}>
        <img alt="toggle" src={toggleButtonPic} />
      </div>
    );
  }
}

export default Footer;
