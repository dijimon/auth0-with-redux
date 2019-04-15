import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import SubItemsList from './SubMenuItems';

export default class SideMenuItem extends Component {
  static propTypes = {
    id: PropTypes.number,
    item: PropTypes.object.isRequired,
    subItems: PropTypes.array,
    isCollapsible: PropTypes.bool,
    onChangePathname: PropTypes.func.isRequired,
    defaultIconClassName: PropTypes.string.isRequired,
    currentRoute: PropTypes.object,
    expand: PropTypes.bool,
  };

  static defaultProps = {
    id: 0,
    subItems: [],
    isCollapsible: false,
  };

  state = {
    isVisible: false,
  };

  expand = null;

  componentDidUpdate({ currentRoute: { path } }) {
    if (
      !path &&
      this.props.subItems.length > 0 &&
      this.props.currentRoute.path &&
      path !== this.props.currentRoute.path
    )
      this.toggleSubMenus(null, this.props.currentRoute.index === this.props.item.index);
  }

  expandIcon = ref => {
    this.expand = ref;
  };

  getClassName = (to, path) => `menu-item ${path === to ? 'menu-item--active' : ''}`.trim();

  _renderItem = expanded => {
    const { icon, title, iconClassName, plainText } = this.props.item;
    const classNameTitle = plainText ? 'menu-item__plaintext' : 'menu-item__title';
    return [
      iconClassName || typeof icon === 'string' ? (
        <i key="icon" className={`${iconClassName || this.props.defaultIconClassName} menu-item__icon`}>
          {icon}
        </i>
      ) : (
        icon
      ),
      expanded ? null : (
        <span key="title" className={classNameTitle}>
          {title}
        </span>
      ),
    ];
  };

  toggleSubMenus = (_, isVisible = !this.state.isVisible) => {
    this.setState({ isVisible });
  };

  setCurrentRoute = (_, path = this.props.item.to) => {
    this.props.onChangePathname(this.props.item.index, path);
  };

  render() {
    const {
      id,
      item: { to },
      isCollapsible,
      subItems,
      currentRoute: { path },
      defaultIconClassName,
      expanded,
    } = this.props;
    const { isVisible } = this.state;
    return (
      <li id={`menuItem-${id}`} className={this.getClassName(to, path)} onClickCapture={to ? this.setCurrentRoute : null}>
        {to ? (
          <Link className="menu-item__link" to={to}>
            {this._renderItem()}
          </Link>
        ) : (
          <div
            className={`menu-item__container ${isCollapsible ? 'menu-item--collapsible' : ''}`.trim()}
            onClick={isCollapsible ? this.toggleSubMenus : null}
          >
            {this._renderItem(expanded)}
            {isCollapsible && (
              <i
                ref={this.expandIcon}
                className={`material-icons menu-item__expand-icon ${isVisible ? 'rotate-down' : ''}`.trim()}
              >
                expand_more
              </i>
            )}
          </div>
        )}
        {subItems.length > 0 && (
          <SubItemsList
            items={subItems}
            opened={!isCollapsible ? true : isVisible}
            path={path}
            setPathname={this.setCurrentRoute}
            defaultIconClassName={defaultIconClassName}
          />
        )}
      </li>
    );
  }
}
