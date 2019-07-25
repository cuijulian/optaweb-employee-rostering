/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, { Component } from 'react'; 
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { mockStore } from '../mockStore';
import { AppState } from '../types';
import * as actions from './actions';
import { ServerSideExceptionDialog } from './operations';
import reducer, { alert } from './index';
import { withElement, withoutElementWithId} from 'util/ImmutableCollectionOperations';
import { ServerSideExceptionInfo } from 'types';
import { AlertInfo } from './types';

describe('Alert operations', () => {
  it('should dispatch actions on showSuccessMessage', async () => {
    const { store } = mockStore(state);
    const i18nKey = "test";

    await store.dispatch(alert.showSuccessMessage(i18nKey));
    expect(store.getActions()).toEqual([alert.showMessage("success", i18nKey)]);
  });

  it('should dispatch actions on showInfoMessage', async () => {
    const { store } = mockStore(state);
    const i18nKey = "test";
    
    await store.dispatch(alert.showInfoMessage(i18nKey));
    expect(store.getActions()).toEqual([alert.showMessage("info", i18nKey)]);
  });

  it('should dispatch actions on showErrorMessage', async () => {
    const { store } = mockStore(state);
    const i18nKey = "test";
    const params = { errorMsg: "Hi" };
    
    await store.dispatch(alert.showErrorMessage(i18nKey, params));
    expect(store.getActions()).toEqual([alert.showMessage("danger", i18nKey, params)]);
  });


  it('should dispatch actions on showServerError', async () => {
    const { store } = mockStore(state);
    const serverSideException: ServerSideExceptionInfo = {
      i18nKey: "error1",
      exceptionMessage: "message1",
      exceptionClass: "Error1",
      messageParameters: ["hi"],
      stackTrace: ["1.1", "1.2", "1.3"],
      exceptionCause: {
        i18nKey: "error2",
        exceptionMessage: "message2",
        exceptionClass: "Error2",
        messageParameters: [],
        stackTrace: ["2.1", "2.2", "2.3"],
        exceptionCause: null
      }
    };
    
    await store.dispatch(alert.showServerError(serverSideException));
    expect(store.getActions()).toEqual([alert.showMessage("danger", "exception", { message: "message1" }, [<ServerSideExceptionDialog {...serverSideException} key={0} />])]);
  });

  it('should dispatch actions on showServerErrorMessage', async () => {
    const { store } = mockStore(state);
    const i18nKey = "generic";
    const params = { message: "Hi" };
    
    await store.dispatch(alert.showServerErrorMessage(params.message));
    expect(store.getActions()).toEqual([alert.showMessage("danger", i18nKey, params)]);
  });

  it('should render an ServerSideException Alert correctly', () => {
    const serverSideException: ServerSideExceptionInfo = {
      i18nKey: "error1",
      exceptionMessage: "message1",
      exceptionClass: "Error1",
      messageParameters: ["hi"],
      stackTrace: ["1.1", "1.2", "1.3"],
      exceptionCause: {
        i18nKey: "error2",
        exceptionMessage: "message2",
        exceptionClass: "Error2",
        messageParameters: [],
        stackTrace: ["2.1", "2.2", "2.3"],
        exceptionCause: null
      }
    };

    const serverSideExceptionDialog = shallow(<ServerSideExceptionDialog {...serverSideException}>Show Stack Trace</ServerSideExceptionDialog>);
    expect(toJson(serverSideExceptionDialog)).toMatchSnapshot();
  });

  it('should render an ServerSideException Modal correctly', () => {
    const serverSideException: ServerSideExceptionInfo = {
      i18nKey: "error1",
      exceptionMessage: "message1",
      exceptionClass: "Error1",
      messageParameters: ["hi"],
      stackTrace: ["1.1", "1.2", "1.3"],
      exceptionCause: {
        i18nKey: "error2",
        exceptionMessage: "message2",
        exceptionClass: "Error2",
        messageParameters: [],
        stackTrace: ["2.1", "2.2", "2.3"],
        exceptionCause: null
      }
    };

    const serverSideExceptionDialog = shallow(<ServerSideExceptionDialog {...serverSideException}>Show Stack Trace</ServerSideExceptionDialog>);
    serverSideExceptionDialog.find('Button[aria-label="Show Stack Trace"]').simulate("click");
    expect(toJson(serverSideExceptionDialog)).toMatchSnapshot();
  });

  it('should dispatch actions on showMessage', async () => {
    const { store } = mockStore(state);
    const variant = "success";
    const i18nKey = "generic";
    
    await store.dispatch(alert.showMessage(variant, i18nKey));
    expect(store.getActions()).toEqual([
      alert.addAlert({
        variant, i18nKey, params: {}
      })
    ]);
  });

  it('should dispatch actions on addAlert', async () => {
    const { store } = mockStore(state);
    const alertInfo: AlertInfo = {
      i18nKey: "key",
      variant: "info",
      params: { name: "ha" }
    };
    
    await store.dispatch(alert.addAlert(alertInfo));
    expect(store.getActions()).toEqual([
      actions.addAlert( { ...alertInfo, createdAt: new Date() } )
    ]);
  });

  it('should dispatch actions on removeAlert', async () => {
    const { store } = mockStore(state);
    const alertInfo: AlertInfo = {
      id: 1,
      i18nKey: "key",
      variant: "info",
      params: { name: "ha" }
    };
    
    await store.dispatch(alert.removeAlert(alertInfo));
    expect(store.getActions()).toEqual([
      actions.removeAlert(1)
    ]);
  });
});

describe('Alert reducers', () => {
  const addedAlert: AlertInfo = {
    createdAt: new Date(),
    i18nKey: "alert2",
    variant: "success",
    params: {}
  }
  const removedAlertId = 0;

  it("add an alert", () => {
    expect(
      reducer(state.alerts, actions.addAlert(addedAlert))
    ).toEqual({ idGeneratorIndex: 2, alertList: withElement(state.alerts.alertList, { ...addedAlert, id: 1 }) })
  });

  it("remove an alert", () => {
    expect(
      reducer(state.alerts, actions.removeAlert(removedAlertId))
    ).toEqual({ ...state.alerts, alertList: withoutElementWithId(state.alerts.alertList, removedAlertId) });
  });
});

const state: AppState = {
  tenantData: {
    currentTenantId: 0,
    tenantList: []
  },
  employeeList: {
    isLoading: false,
    employeeMapById: new Map()
  },
  contractList: {
    isLoading: false,
    contractMapById: new Map()
  },
  spotList: {
    isLoading: false,
    spotMapById: new Map()
  },
  skillList: {
    isLoading: false,
    skillMapById: new Map()
  },
  rosterState: {
    isLoading: true,
    rosterState: null
  },
  shiftRoster: {
    isLoading: true,
    shiftRosterView: null
  },
  solverState: {
    isSolving: false
  },
  alerts: {
    alertList: [{
      id: 0,
      createdAt: new Date(),
      i18nKey: "alert1",
      variant: "info",
      params: {}
    }],
    idGeneratorIndex: 1
  }
};