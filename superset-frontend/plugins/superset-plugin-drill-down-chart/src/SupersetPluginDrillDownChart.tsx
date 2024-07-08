import React, { useEffect, createRef, useState } from 'react';
import { styled } from '@superset-ui/core';
import {
  SupersetPluginDrillDownChartProps,
  SupersetPluginDrillDownChartStylesProps,
} from './types';

const Styles = styled.div<SupersetPluginDrillDownChartStylesProps>`
  padding: ${({ theme }: any) => theme.gridUnit * 4}px;
  border-radius: ${({ theme }: any) => theme.gridUnit * 2}px;
  height: ${({ height }: any) => height}px;
  width: ${({ width }: any) => width}px;

  h3 {
    /* You can use your props to control CSS! */
    margin-top: 0;
    margin-bottom: ${({ theme }: any) => theme.gridUnit * 3}px;
    font-size: ${({ theme, headerFontSize }: any) =>
      theme.typography.sizes[headerFontSize]}px;
    font-weight: ${({ theme, boldText }: any) =>
      theme.typography.weights[boldText ? 'bold' : 'normal']};
  }

  pre {
    height: ${({ theme, headerFontSize, height }: any) =>
      height - theme.gridUnit * 12 - theme.typography.sizes[headerFontSize]}px;
  }
`;

export default function SupersetPluginDrillDownChart(
  props: SupersetPluginDrillDownChartProps,
) {
  const { data, height, width, metrics, columns } = props;

  const rootElem = createRef<HTMLDivElement>();

  const [selectedColKey, setSelectedColKey] = useState(columns[0]);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [dataValue, setDataValue] = useState<any>([]);
  const [drillDownActive, setDrillDownActive] = useState(true);
  const [columnValue, setColumnValue] = useState([columns[0]]);

  useEffect(() => {
    const root = rootElem.current as HTMLElement;
  });

  const aggregationMethods: any = {};
  metrics.forEach((metric: any) => {
    const label = metric.label;
    const aggregate = metric.aggregate;
    aggregationMethods[label] = aggregate;
  });

  useEffect(() => {
    const filterData = handleFilterData(selectedColKey);
    filterData.sort((a, b) =>
      a[selectedColKey].localeCompare(b[selectedColKey]),
    );
    setFilteredData(filterData);
  }, [selectedColKey]);

  useEffect(() => {
    // const columns = filteredData?.cols;
    // const metricsValue = filteredData?.metrics;
    // Create a set of allowed keys from columnsArray and labels from metricsArray
    const allowedKeys = new Set(columns);

    metrics?.forEach((metric: any) => {
      if (typeof metric === 'string') {
        allowedKeys.add(metric);
      } else if (typeof metric === 'object') {
        allowedKeys.add(metric.label);
      }
    });

    // Function to clean up each object in the dataArray
    const cleanedDataArray = filteredData.map((item: any) => {
      const cleanedItem: any = {};
      Object.keys(item).forEach(key => {
        if (allowedKeys.has(key)) {
          cleanedItem[key] = item[key];
        }
      });
      return cleanedItem;
    });

    const newData = cleanedDataArray?.map(item => {
      const newObj = { ...item };
      for (const key in newObj) {
        if (Object.hasOwnProperty.call(newObj, key)) {
          const value = newObj[key];
          if (value !== null) {
            if (typeof value === 'object' && value?.c) {
              newObj[key] = value?.c[0];
            }
          }
          if (value === null) {
            newObj[key] = null;
          }
        }
      }
      return newObj;
    });

    // Define aggregation methods for each metric

    const aggregationMethods: any = {};

    metrics.forEach((metric: any) => {
      const label = metric.label;
      const aggregate = metric.aggregate;
      aggregationMethods[label] = aggregate;
    });

    const resultMap = new Map();

    newData.forEach((entry: any) => {
      const dynamicKey = columns.map((key: any) => entry[key]).join('-');
      const dynamicValues: any = Object.keys(entry)
        .filter(key => !columns.includes(key))
        .reduce((obj: any, key) => {
          obj[key] = entry[key];
          return obj;
        }, {});

      if (resultMap.has(dynamicKey)) {
        const existingEntry = resultMap.get(dynamicKey);
        Object.keys(dynamicValues).forEach(dynamicValueKey => {
          const method = aggregationMethods[dynamicValueKey];
          if (method === 'SUM') {
            existingEntry[dynamicValueKey] += dynamicValues[dynamicValueKey];
          } else if (
            method === 'AVG' &&
            existingEntry[dynamicValueKey] !== null
          ) {
            existingEntry[dynamicValueKey] += dynamicValues[dynamicValueKey];
            existingEntry[`${dynamicValueKey}_count`] += 1;
          } else if (method === 'COUNT') {
            existingEntry[dynamicValueKey] += dynamicValues[dynamicValueKey];
          } else if (method === 'MAX') {
            existingEntry[dynamicValueKey] = Math.max(
              existingEntry[dynamicValueKey],
              dynamicValues[dynamicValueKey],
            );
          } else if (method === 'MIN') {
            existingEntry[dynamicValueKey] = Math.min(
              existingEntry[dynamicValueKey],
              dynamicValues[dynamicValueKey],
            );
          }
        });
      } else {
        const newEntry = { ...entry };
        Object.keys(dynamicValues).forEach(dynamicValueKey => {
          const method = aggregationMethods[dynamicValueKey];
          if (method === 'AVG' && dynamicValues[dynamicValueKey] !== null) {
            newEntry[`${dynamicValueKey}_count`] = 1;
          } else if (method === 'COUNT_DISTINCT') {
            newEntry[`${dynamicValueKey}_set`] = new Set([
              dynamicValues[dynamicValueKey],
            ]);
          }
        });
        resultMap.set(dynamicKey, newEntry);
      }
    });

    // Calculate the averages and convert count distinct sets to counts
    resultMap.forEach(entry => {
      Object.keys(entry).forEach(key => {
        if (key.endsWith('_count')) {
          const originalKey = key.replace('_count', '');
          entry[originalKey] /= entry[key];
          delete entry[key];
        } else if (key.endsWith('_set')) {
          const originalKey = key.replace('_set', '');
          entry[originalKey] = entry[key].size;
          delete entry[key];
        }
      });
    });

    // Convert the map back to an array
    const resultArray = Array.from(resultMap.values());
    setDataValue(resultArray);
  }, [filteredData]);

  const handleFilterData = (key: any) => {
    const a = data.map(item => {
      let newItem = { [key]: item[key], ...item };

      columns.forEach((k: any) => {
        if (k !== key) {
          delete newItem[k];
        }
      });
      return newItem;
    });
    return a;
  };

  const handleDrillDownFilter = (
    colKey: any,
    colValue: any,
    nextColumnKey: any,
  ) => {
    let abc: any = [];
    let newItem: any = {};
     data.map(val => {
      if (val[colKey] === colValue) {
        newItem = { [nextColumnKey]: val[nextColumnKey], ...val };

        columns.forEach((k: any) => {
          if (k !== nextColumnKey) {
            delete newItem[k];
          }
        });
        abc.push(newItem);
      }
    });
    return abc;
  };

  // const handleSelectKey = (key: any) => {
  //   setSelectedColKey(key);
  // };

  const columnRender = () => {
    return (
      <div>
        <text>All Values by: </text>
        {columns?.map((item: any) => {
          return (
            <text
              className="pointer"
              style={{
                fontWeight: 'bold',
                marginRight: 16,
                color: selectedColKey === item ? 'red' : 'black',
              }}
              // onClick={() => handleSelectKey(item)}
            >
              {item.toUpperCase()}
            </text>
          );
        })}
      </div>
    );
  };

  const elementClicked = (key: any, value: any) => {
    // to find out the Level of flow
    let atLevel = columns.indexOf(key);
    const newArr = columns.slice(0, atLevel + 2);
    setColumnValue(newArr);

    let nextColumnKey: any;
    columns.forEach((element, i) => {
      if (atLevel === i && i < columns.length - 1) {
        nextColumnKey = columns[i + 1];
      }
    });
    if (nextColumnKey) {
      const filterData = handleDrillDownFilter(key, value, nextColumnKey);
      filterData.sort((a, b) =>
        a[nextColumnKey].localeCompare(b[nextColumnKey]),
      );
      setFilteredData(filterData);
    }
  };

  const handleCheckbox = (e: any) => {
    setDrillDownActive(e.target.checked);
    console.log('checkbox: ', e.target.checked);
  };

  const handleDrilldownState=(key:any)=>{
    setSelectedColKey(key);
  }

  return (
    <Styles
      ref={rootElem}
      boldText={props.boldText}
      headerFontSize={props.headerFontSize}
      height={height}
      width={width}
    >
      <h3>{props.headerText}</h3>

      <div>
        <text>Drill Down Activated: </text>
        <input
          type="checkbox"
          id="vehicle1"
          name="vehicle1"
          value="Bike"
          onChange={handleCheckbox}
        />
      </div>
      {!drillDownActive ? (
        <div style={{ marginBottom: '20px' }}>{columnRender()}</div>
      ) : (
        <>
          <div>
            {columnValue?.map((item: any) => {
              return (
                <text
                  className="pointer"
                  style={{
                    fontWeight: 'bold',
                    marginRight: 16,
                  }}
                  onClick={() => handleDrilldownState(item)}
                >
                  {item.toUpperCase()} >
                </text>
              );
            })}
          </div>
        </>
      )}
      <div>
        {dataValue.length !== 0 &&
          dataValue?.map((item: any) => {
            return columns?.map((value: any) => {
              if (item[value]) {
                return (
                  <div
                    style={{
                      backgroundColor: ' #e6d0ad87',
                      border: 'solid 1px',
                      borderRadius: '4px',
                      padding: '10px',
                      marginBottom: '10px',
                      width:'fit-content'
                    }}
                    onClick={() => elementClicked(value, item[value])}
                  >
                    <div>
                      <text>{value}: </text>
                      <text>{item[value]}</text>
                    </div>
                    {metrics.map(key => {
                      return (
                        <div>
                          <text>{key.label}:</text>
                          <text>{item[key.label]}</text>
                        </div>
                      );
                    })}
                  </div>
                );
              }
            });
          })}
      </div>
    </Styles>
  );
}
