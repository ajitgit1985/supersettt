/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, { Suspense, useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { GlobalStyles } from 'src/GlobalStyles';
import ErrorBoundary from 'src/components/ErrorBoundary';
import Loading from 'src/components/Loading';
import Menu from 'src/features/home/Menu';
import getBootstrapData from 'src/utils/getBootstrapData';
import ToastContainer from 'src/components/MessageToasts/ToastContainer';
import setupApp from 'src/setup/setupApp';
import setupPlugins from 'src/setup/setupPlugins';
import { routes, isFrontendRoute } from 'src/views/routes';
import { Logger, LOG_ACTIONS_SPA_NAVIGATION } from 'src/logger/LogUtils';
import setupExtensions from 'src/setup/setupExtensions';
import { logEvent } from 'src/logger/actions';
import { store } from 'src/views/store';
import { RootContextProviders } from './RootContextProviders';
import { ScrollToTop } from './ScrollToTop';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faTimes } from '@fortawesome/free-solid-svg-icons';
import Chatbot from 'react-chatbot-kit';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Config from './Config';
import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';
import './App.css';
import './main.css';
import { Player } from '@lottiefiles/react-lottie-player';

setupApp();
setupPlugins();
setupExtensions();

const bootstrapData = getBootstrapData();

let lastLocationPathname: string;

const boundActions = bindActionCreators({ logEvent }, store.dispatch);

const LocationPathnameLogger = () => {
  const location = useLocation();
  useEffect(() => {
    // This will log client side route changes for single page app user navigation
    boundActions.logEvent(LOG_ACTIONS_SPA_NAVIGATION, {
      path: location.pathname,
    });
    // reset performance logger timer start point to avoid soft navigation
    // cause dashboard perf measurement problem
    if (lastLocationPathname && lastLocationPathname !== location.pathname) {
      Logger.markTimeOrigin();
    }
    lastLocationPathname = location.pathname;
  }, [location.pathname]);
  return <></>;
};

export function renderChatBotView() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="floating-chatbot">
      {!isOpen && (
        <div onClick={toggleChatbot}>
          <Player
            src="https://lottie.host/e35cb32b-52ce-4e14-b8f2-b8dc5e969ead/20KN8Rh4TO.json"
            className="player"
            style={{
              height: '80px',
              width: '80px',
            }}
            autoplay={true}
            loop={true}
          />
        </div>
      )}

      {isOpen && (
        <button
          className="btn btn-secondary"
          style={{
            position: 'absolute',
            top: '0px',
            right: '0px',
            zIndex: 9999,
            backgroundColor: '#318cd5',
            height: '40px',
            color: 'white',
          }}
          onClick={toggleChatbot}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      )}

      {/* Chatbot component */}
      {isOpen && (
        <Chatbot
          config={Config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
        />
      )}
    </div>
  );
}

const App = () => (
  <Router>
    {renderChatBotView()}
    <ScrollToTop />
    <LocationPathnameLogger />
    <RootContextProviders>
      <GlobalStyles />
      <Menu
        data={bootstrapData.common.menu_data}
        isFrontendRoute={isFrontendRoute}
      />
      <Switch>
        {routes.map(({ path, Component, props = {}, Fallback = Loading }) => (
          <Route path={path} key={path}>
            <Suspense fallback={<Fallback />}>
              <ErrorBoundary>
                <Component user={bootstrapData.user} {...props} />
              </ErrorBoundary>
            </Suspense>
          </Route>
        ))}
      </Switch>
      <ToastContainer />
    </RootContextProviders>
  </Router>
);

export default hot(App);
