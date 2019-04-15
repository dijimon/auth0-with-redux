import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import SideMenuItem from './SideMenuItem';
import Footer from './Footer';
import Header from './Header';

class SideMenu extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool,
    items: PropTypes.array.isRequired,
    isExpandable: PropTypes.bool,
    defaultIconClassName: PropTypes.string,
  };

  static defaultProps = {
    isOpen: true,
    isExpandable: false,
    defaultIconClassName: 'material-icons',
  };

  state = {
    expanded: false,
    currentRoute: {
      index: 0,
      path: null,
    },
  };

  menuRef = null;

  static getDerivedStateFromProps({ isExpandable }, { expanded }) {
    if (!isExpandable && expanded)
      return {
        expanded: false,
      };
    return null;
  }

  componentDidMount() {
    let currentRoute = {
      index: 0,
      path: '/',
    };
    const { pathname } = window.location;
    const { items } = this.props;
    items.forEach((item, index) => {
      if (item.to && pathname.indexOf(item.to) !== -1) {
        currentRoute = {
          index,
          path: item.to,
        };
      } else if (item.subItems) {
        item.subItems.forEach(subItem => {
          if (pathname.indexOf(subItem.to) !== -1) {
            currentRoute = {
              index,
              path: subItem.to,
            };
          }
        });
      }
    });
    this.setState({ currentRoute });
  }

  setMenuRef = ref => {
    this.menuRef = ref;
  };

  getClassName = (isOpen, isExpandable) => {
    let className = 'nav-container';
    if (isExpandable) {
      className += this.state.expanded ? ' nav-container--expanded' : !isOpen ? ' nav-container--closed' : '';
      return className;
    }
    if (!isOpen) className += ' nav-container--closed';

    return className;
  };

  onExpand = () => {
    this.setState(prevState => ({
      expanded: !prevState.expanded,
    }));
  };

  onChangePathname = (index, path) => {
    this.setState({
      currentRoute: {
        index,
        path,
      },
    });
  };

  render() {
    const { items, isOpen, isExpandable, defaultIconClassName } = this.props;
    const { expanded } = this.state;
    let styles = {};
    if (!expanded) {
      styles = { ...styles, ...{ width: '270px', overflow: 'hidden', overflowY: 'auto' } };
    } else {
      styles = { ...styles, ...{ width: '60px', overflow: 'hidden', overflowY: 'auto' } };
    }

    return [
      <nav key="nav-container" className={this.getClassName(isOpen, isExpandable)}>
        {isExpandable && <Footer onExpand={this.onExpand} expanded={expanded} />}
        <Header logo={!expanded ? '/public/assets/top-menu-logo.png' : ''} title="" />
        <ul className="side-menu" ref={this.setMenuRef} style={styles}>
          {items.map(({ icon, title, subItems, isCollapsible, to, iconClassName, plainText }, index) => (
            <SideMenuItem
              key={index.toString()}
              item={{
                icon,
                title,
                to,
                index,
                iconClassName,
                plainText,
              }}
              subItems={subItems}
              isCollapsible={isCollapsible}
              onChangePathname={this.onChangePathname}
              currentRoute={this.state.currentRoute}
              defaultIconClassName={defaultIconClassName}
              expanded={expanded}
            />
          ))}
        </ul>
      </nav>,
      <div
        key="nav-container__separator"
        className={`nav-container__separator ${
          expanded ? 'nav-container__separator--expanded' : !isOpen ? 'nav-container__separator--hidden' : ''
        }`.trim()}
      />,
    ];
  }
}

export default SideMenu;
