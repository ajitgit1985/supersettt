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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ChartDataResponseResult,
  Behavior,
  DataMask,
  isFeatureEnabled,
  FeatureFlag,
  getChartMetadataRegistry,
  JsonObject,
  QueryFormData,
  styled,
  SuperChart,
  t,
} from '@superset-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual, isEqualWith } from 'lodash';
import { getChartDataRequest } from 'src/components/Chart/chartAction';
import Loading from 'src/components/Loading';
import BasicErrorAlert from 'src/components/ErrorMessage/BasicErrorAlert';
import ErrorMessageWithStackTrace from 'src/components/ErrorMessage/ErrorMessageWithStackTrace';
import { waitForAsyncData } from 'src/middleware/asyncEvent';
import {
  ClientErrorObject,
  getClientErrorObject,
} from 'src/utils/getClientErrorObject';
import { FilterBarOrientation, RootState } from 'src/dashboard/types';
import {
  onFiltersRefreshSuccess,
  setDirectPathToChild,
} from 'src/dashboard/actions/dashboardState';
import { FAST_DEBOUNCE } from 'src/constants';
import { dispatchHoverAction, dispatchFocusAction } from './utils';
import { FilterControlProps } from './types';
import { getFormData } from '../../utils';
import { useFilterDependencies } from './state';
import { useFilterOutlined } from '../useFilterOutlined';
import { useSetAtom } from 'jotai';
import { dashboardFilterSelected } from 'src/views/atoms';
import { filtersQuarterSorting } from 'plugins/helpingMethoads/methods';

// Overrides superset-ui height with min-height
const StyledDiv = styled.div`
  & > div {
    height: auto !important;
    min-height: auto !important;
  }
`;

const queriesDataPlaceholder = [{ data: [{}] }];
const behaviors = [Behavior.NATIVE_FILTER];

const useShouldFilterRefresh = () => {
  const isDashboardRefreshing = useSelector<RootState, boolean>(
    state => state.dashboardState.isRefreshing,
  );
  const isFilterRefreshing = useSelector<RootState, boolean>(
    state => state.dashboardState.isFiltersRefreshing,
  );

  // trigger filter requests only after charts requests were triggered
  return !isDashboardRefreshing && isFilterRefreshing;
};

// Add an event listener for the beforeunload event custom code. nicsi_custom_code
window.addEventListener('beforeunload', () => {
  localStorage.clear();
});

const FilterValue: React.FC<FilterControlProps> = ({
  dataMaskSelected,
  filter,
  onFilterSelectionChange,
  inView = true,
  showOverflow,
  parentRef,
  setFilterActive,
  orientation = FilterBarOrientation.HORIZONTAL,
  overflow = true,
  validateStatus,
}) => {
  const { id, targets, filterType, adhoc_filters, time_range } = filter;

  // nicsi_custom_code code starts
  const [userInput, setUserInput] = useState(() => {
    const storedUserInput = localStorage.getItem('userInput');
    return storedUserInput || '';
  });

  // Load the userInput from localStorage when the component mounts
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUserInput(input); // Update the state with the input value
    localStorage.setItem('userInput', input);
  };
  // nicsi_custom_code code ends

  const metadata = getChartMetadataRegistry().get(filterType);
  const dependencies = useFilterDependencies(id, dataMaskSelected);
  const shouldRefresh = useShouldFilterRefresh();
  const [state, setState] = useState<ChartDataResponseResult[]>([]);
  const dashboardId = useSelector<RootState, number>(
    state => state.dashboardInfo.id,
  );
  const [error, setError] = useState<ClientErrorObject>();
  const [formData, setFormData] = useState<Partial<QueryFormData>>({
    inView: false,
  });
  const [ownState, setOwnState] = useState<JsonObject>({});
  const [inViewFirstTime, setInViewFirstTime] = useState(inView);
  const inputRef = useRef<HTMLInputElement>(null);
  const [target] = targets;
  const {
    datasetId,
    column = {},
  }: Partial<{ datasetId: number; column: { name?: string } }> = target;
  const { name: groupby } = column;
  const hasDataSource = !!datasetId;
  const [isLoading, setIsLoading] = useState<boolean>(hasDataSource);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dispatch = useDispatch();

  const { outlinedFilterId, lastUpdated } = useFilterOutlined();

  const handleFilterLoadFinish = useCallback(() => {
    setIsRefreshing(false);
    setIsLoading(false);
    if (shouldRefresh) {
      dispatch(onFiltersRefreshSuccess());
    }
  }, [dispatch, shouldRefresh]);

  useEffect(() => {
    if (!inViewFirstTime && inView) {
      setInViewFirstTime(true);
    }
  }, [inView, inViewFirstTime, setInViewFirstTime]);
  useEffect(() => {
    if (!inViewFirstTime) {
      return;
    }
    const newFormData = getFormData({
      ...filter,
      datasetId,
      dependencies,
      groupby,
      adhoc_filters,
      time_range,
      dashboardId,
    });

    const filterOwnState = filter.dataMask?.ownState || {};
    // TODO: We should try to improve our useEffect hooks to depend more on
    // granular information instead of big objects that require deep comparison.
    const customizer = (
      objValue: Partial<QueryFormData>,
      othValue: Partial<QueryFormData>,
      key: string,
    ) => (key === 'url_params' ? true : undefined);
    if (
      !isRefreshing &&
      (!isEqualWith(formData, newFormData, customizer) ||
        !isEqual(ownState, filterOwnState) ||
        shouldRefresh)
    ) {
      setFormData(newFormData);
      setOwnState(filterOwnState);
      if (!hasDataSource) {
        return;
      }
      setIsRefreshing(true);
      getChartDataRequest({
        formData: newFormData,
        force: false,
        ownState: filterOwnState,
      })
        .then(({ response, json }) => {
          if (isFeatureEnabled(FeatureFlag.GLOBAL_ASYNC_QUERIES)) {
            // deal with getChartDataRequest transforming the response data
            const result = 'result' in json ? json.result[0] : json;

            if (response.status === 200) {
              setState([result]);
              handleFilterLoadFinish();
            } else if (response.status === 202) {
              waitForAsyncData(result)
                .then((asyncResult: ChartDataResponseResult[]) => {
                  setState(asyncResult);
                  handleFilterLoadFinish();
                })
                .catch((error: Response) => {
                  getClientErrorObject(error).then(clientErrorObject => {
                    setError(clientErrorObject);
                    handleFilterLoadFinish();
                  });
                });
            } else {
              throw new Error(
                `Received unexpected response status (${response.status}) while fetching chart data`,
              );
            }
          } else {
            setState(json.result);
            setError(undefined);
            handleFilterLoadFinish();
          }
        })
        .catch((error: Response) => {
          getClientErrorObject(error).then(clientErrorObject => {
            setError(clientErrorObject);
            handleFilterLoadFinish();
          });
        });
    }
  }, [
    inViewFirstTime,
    dependencies,
    datasetId,
    groupby,
    handleFilterLoadFinish,
    JSON.stringify(filter),
    hasDataSource,
    isRefreshing,
    shouldRefresh,
    userInput, // Include count as a dependency  nicsi_custom_code
  ]);

  useEffect(() => {
    if (outlinedFilterId && outlinedFilterId === filter.id) {
      setTimeout(
        () => {
          inputRef?.current?.focus();
        },
        overflow ? FAST_DEBOUNCE : 0,
      );
    }
  }, [inputRef, outlinedFilterId, lastUpdated, filter.id, overflow]);

  const setDataMask = useCallback(
    (dataMask: DataMask) => onFilterSelectionChange(filter, dataMask),
    [filter, onFilterSelectionChange],
  );

  const setFocusedFilter = useCallback(() => {
    // don't highlight charts in scope if filter was focused programmatically
    if (outlinedFilterId !== id) {
      dispatchFocusAction(dispatch, id);
    }
  }, [dispatch, id, outlinedFilterId]);

  const unsetFocusedFilter = useCallback(() => {
    dispatchFocusAction(dispatch);
    if (outlinedFilterId === id) {
      dispatch(setDirectPathToChild([]));
    }
  }, [dispatch, id, outlinedFilterId]);

  const setHoveredFilter = useCallback(
    () => dispatchHoverAction(dispatch, id),
    [dispatch, id],
  );
  const unsetHoveredFilter = useCallback(
    () => dispatchHoverAction(dispatch),
    [dispatch],
  );

  const hooks = useMemo(
    () => ({
      setDataMask,
      setHoveredFilter,
      unsetHoveredFilter,
      setFocusedFilter,
      unsetFocusedFilter,
      setFilterActive,
    }),
    [
      setDataMask,
      setFilterActive,
      setHoveredFilter,
      unsetHoveredFilter,
      setFocusedFilter,
      unsetFocusedFilter,
    ],
  );

  const filterState = useMemo(
    () => ({
      ...filter.dataMask?.filterState,
      validateStatus,
    }),
    [filter.dataMask?.filterState, validateStatus],
  );

  const displaySettings = useMemo(
    () => ({
      filterBarOrientation: orientation,
      isOverflowingFilterBar: overflow,
    }),
    [orientation, overflow],
  );

  if (error) {
    return (
      <ErrorMessageWithStackTrace
        error={error.errors?.[0]}
        fallback={
          <BasicErrorAlert
            title={t('Cannot load filter')}
            body={error.error}
            level="error"
          />
        }
      />
    );
  }

  // Retrieve the sortAscending value from sessionStorage and convert it back to a boolean nicsi_custom_code
  const storedSortAscending = sessionStorage.getItem('sortAscending');

  const setDashboardFilterSelected = useSetAtom(dashboardFilterSelected);
  if (filterState?.value !== null && filterState?.value !== undefined) {
    setDashboardFilterSelected(true);
  } else {
    setDashboardFilterSelected(false);
  }

  // sorting the filter values for quarter years
  const isQuarterSelected = state[0]?.colnames[0]?.includes('quarter');
  if (isQuarterSelected) {
    filtersQuarterSorting(state[0]?.data);
  }

  return (
    <StyledDiv data-test="form-item-value gg">
      {isLoading ? (
        <Loading position="inline-centered" />
      ) : (
        <div>
          {/* // nicsi_custom_code starts taking input from the user nth values they want to see on the chart. */}
          {storedSortAscending !== undefined && storedSortAscending !== null && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <input
                type="number"
                placeholder="Enter nth no."
                value={userInput}
                onChange={handleInputChange}
                style={{ flex: 1 }}
              />
            </div>
          )}
          {/* // nicsi_custom_code ends */}

          <SuperChart
            height="auto"
            width="100%"
            showOverflow={showOverflow}
            formData={formData}
            displaySettings={displaySettings}
            parentRef={parentRef}
            inputRef={inputRef}
            // For charts that don't have datasource we need workaround for empty placeholder
            queriesData={hasDataSource ? state : queriesDataPlaceholder}
            chartType={filterType}
            behaviors={behaviors}
            filterState={filterState}
            ownState={filter.dataMask?.ownState}
            enableNoResults={metadata?.enableNoResults}
            isRefreshing={isRefreshing}
            hooks={hooks}
          />
        </div>
      )}
    </StyledDiv>
  );
};
export default React.memo(FilterValue);
