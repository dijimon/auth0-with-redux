import React from 'react';

export const MENU_ITEMS = [
  {
    title: 'Dashboard',
    icon: <i className="material-icons">dashboard</i>,
    to: '/dashboard',
  },
  {
    title: ' COMPONENTS',
    plainText: true,
  },
  {
    title: 'Peers',
    iconClassName: 'fa fa-sitemap',
    to: '/peers',
  },
  {
    title: 'Orderers',
    icon: <i className="material-icons">supervisor_account</i>,
    to: '/orderers',
  },
  {
    title: 'CAs',
    icon: <i className="material-icons">verified_user</i>,
    to: '/cas',
  },
  {
    title: 'Channels',
    icon: <i className="material-icons">linear_scale</i>,
    to: '/channels',
  },
  {
    title: 'Chaincodes',
    icon: <i className="material-icons">description</i>,
    to: '/chaincodes',
  },
];
