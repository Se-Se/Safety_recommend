import { Layout as TeaLayout, NavMenu } from '@tencent/tea-component';
import React from 'react';
import cookie from 'react-cookies';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { AppMenu } from '../types';
import Menu from './Menu';

const { Header, Body, Sider } = TeaLayout;

interface LayoutProps extends RouteComponentProps<any> {
  menu: AppMenu;
}

export default withRouter<LayoutProps, React.ComponentType<LayoutProps>>(function Layout({ history, menu, children }) {
  const isMain = history.location.pathname === '/main' ? false : true;
  const isEdit = history.location.pathname === '/edit' ? false : true;
  const val = cookie.load('safetyTrade');
  if (history.location.pathname !== '/main' && !val) {
    history.push('/main');
  }
  return (
    <TeaLayout>
      <Header>
        <NavMenu
          left={
            <NavMenu.Item type="logo" onClick={() => history.push('/')}>
              <img src="//imgcache.qq.com/qcloud/app/tea/logo.svg" alt="logo" />
            </NavMenu.Item>
          }
        />
      </Header>
      <Body>
        {menu && isMain && isEdit && (
          <Sider>
            <Menu menu={menu} />
          </Sider>
        )}
        {children}
      </Body>
    </TeaLayout>
  );
});
