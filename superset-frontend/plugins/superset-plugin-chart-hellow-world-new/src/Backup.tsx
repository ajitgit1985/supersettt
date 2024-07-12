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
import React, { useEffect, createRef, useRef, useState } from 'react';
import { styled } from '@superset-ui/core';
import {
  SupersetPluginChartHellowWorldNewProps,
  SupersetPluginChartHellowWorldNewStylesProps,
} from './types';
import './home.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled

// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

// const Styles = styled.div<SupersetPluginChartHellowWorldNewStylesProps>`
//   // background-color: ${({ theme }) =>  theme.colors.secondary.light2};
//   padding: ${({ theme }) => theme.gridUnit * 4}px;
//   border-radius: ${({ theme }) => theme.gridUnit * 2}px;
//   height: ${({ height }) => height}px;
//   width: ${({ width }) => width}px;

//   h3 {
//     /* You can use your props to control CSS! */
//     margin-top: 0;
//     margin-bottom: ${({ theme }) => theme.gridUnit * 3}px;
//     font-size: ${({ theme, headerFontSize }) =>
//       theme.typography.sizes[headerFontSize]}px;
//     font-weight: ${({ theme, boldText }) =>
//       theme.typography.weights[boldText ? 'bold' : 'normal']};
//   }

//   pre {
//     height: ${({ theme, headerFontSize, height }) =>
//       height - theme.gridUnit * 12 - theme.typography.sizes[headerFontSize]}px;
//   }
//   `;

/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */

export default function SupersetPluginChartHellowWorldNew(
  props: SupersetPluginChartHellowWorldNewProps,
) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  const { data, height, width } = props;
  const [labelsCount, setLabelsCount] = useState<number>();
  const [totalWidth, setTotalWidth] = useState<any>(width);
  const [barWidth, setBarWidth] = useState(15);

  const rootElem = createRef<HTMLDivElement>();

  // Often, you just want to access the DOM and do whatever you want.
  // Here, you can do that with createRef, and the useEffect hook.
  useEffect(() => {
    const root = rootElem.current as HTMLElement;
  });

  const inputData = data;

  // ************* Start *************  data grouping as per cols values
  const generateStructure = (data: any, cols: any) => {
    const result = {};
    data.forEach((item: any) => {
      let current: any = result;
      cols.forEach((col: any, index: any) => {
        const value = item[col];

        if (!current[value]) {
          current[value] = index === cols?.length - 1 ? {} : {};
        }

        current = current[value];
      });
    });
    return result;
  };

  const generateResult = (data: any, structure: any, cols: any) => {
    data.forEach((item: any) => {
      let current = structure;

      cols.forEach((col: any, index: any) => {
        const value = item[col];

        if (index === cols?.length - 1) {
          if (!current[value]) {
            current[value] = {};
          }
          current[value] = {
            ...current[value],
            ...item, // Add the data for the last column value
          };
        } else {
          current = current[value];
        }
      });
    });

    return structure;
  };

  const uniqueCols = Array.from(
    new Set(inputData.reduce((acc, item) => acc.concat(item.cols), [])),
  );

  const structuredData = generateStructure(inputData, uniqueCols);
  const result = generateResult(inputData, structuredData, uniqueCols);

  const finalResult = {
    cols: uniqueCols,
    data: result,
  };
  // ************ End ************* data grouping as per cols values

  // ************* Start ************* unique values as per col values.
  const getUniqueValues = (firstData: any, secondCriteria: any) => {
    const uniqueValues: any = {};

    // Iterate through the criteria and initialize variables as arrays
    secondCriteria.forEach((criteria: any) => {
      uniqueValues[criteria] = [];
    });

    // Iterate through the first dataset
    firstData.forEach((item: any) => {
      // Check if the item matches the criteria from the second dataset
      const matchesCriteria = secondCriteria.every((criteria: any) => {
        return item.cols.includes(criteria);
      });

      // If it matches, extract the unique values
      if (matchesCriteria) {
        secondCriteria.forEach((criteria: any) => {
          if (!uniqueValues[criteria].includes(item[criteria])) {
            uniqueValues[criteria].push(item[criteria]);
          }
        });
      }
    });

    return uniqueValues; // Return an object with separate variables as arrays for each unique value
  };

  const secondDataCriteria = finalResult.cols;

  const values = getUniqueValues(data, secondDataCriteria);
  console.log('my data v', values);
  // ************* End ************* unique values as per col values

  // ************* Start ************* values for the y axis
  const removeDataByCols = (data: any, colsToRemove: any) => {
    return data.map((item: any) => {
      const newItem = { ...item };
      colsToRemove.forEach((col: any) => {
        delete newItem[col];
      });
      delete newItem.metrics;
      delete newItem.cols;
      return newItem;
    });
  };
  const a = finalResult?.data;

  // To reach the last child in filtered data
  const handleFilterData = (data: any, cols: any, label = []) => {
    let mData: any = [];
    let mapLabels: any = [];

    for (const key in data) {
      const value = data[key];

      if (cols?.length === 1) {
        mData.push(value);
        mapLabels.push([...label, key].join(';')); // Create Labels for map
      } else {
        const subLabels: any = [...label, key];
        const { mData: subData, mapLabels: subMapLabels } = handleFilterData(
          value,
          cols.slice(1),
          subLabels,
        );

        mData = mData.concat(subData);
        mapLabels = mapLabels.concat(subMapLabels);
      }
    }

    return { mData, mapLabels };
  };

  const { mData, mapLabels } = handleFilterData(a, finalResult?.cols);

  const filteredUnitData = removeDataByCols(mData, finalResult.cols);
  // ************* End ************* values for the y axis

  // ************* Create Lables as per the cols *************

  // To know how many chart will be created (means y-axis)
  const yAxisCounts = Object.entries(filteredUnitData[0])?.length; // For Numbers of Charts
  const yAxisUnitNames = Object.keys(filteredUnitData[0]);
  console.log('my data 0909', yAxisUnitNames);

  // For Chart data
  const dataForCharts = filteredUnitData.reduce((acc: any, obj: any) => {
    Object.keys(obj).forEach(key => {
      const existing = acc.find((item: any) => Object.keys(item)[0] === key);
      if (!existing) {
        acc.push({ [key]: [obj[key]] });
      } else {
        existing[key].push(obj[key]);
      }
    });
    return acc;
  }, []);

  // ==================================================================

  const labels = mapLabels;

  // To skip the comman label in x-axis
  // const uniqueLabels: any = [];
  // const labelIndices: any = {};
  // labels.forEach((item: any, index: any) => {
  //   const label = item.split(';')[0]; // Extract label before semicolon
  //   if (!uniqueLabels.includes(label)) {
  //     uniqueLabels.push(label);
  //     labelIndices[label] = [index]; // Store index of the original value
  //   } else {
  //     labelIndices[label].push(index); // Store additional index for the same label
  //   }
  // });

  // generate dynamic Scales for x.
  const handelXScales = (position: string) => {
    const scales: any = {};

    let xAxisKey;

    if (labelsCount) {
      for (let i = 0; i < labelsCount; i++) {
        if (i === 0) {
          xAxisKey = `x`;
        } else {
          xAxisKey = `x${i}`;
        }
        scales[xAxisKey] = {
          stacked: false,
          type: 'category',
          position: position, // assuming position is defined somewhere
          grid: {
            display: true,
            drawOnChartArea: false,
          },
          ticks: {
            display: true,
            font: {
              weight: 'bold',
              size: 10,
            },
            maxRotation: 90,
            minRotation: 90,
            callback: function (label: string, index) {
              let realLabel: string = this.getLabelForValue(label);
              var firstValue = realLabel.split(';')[i];
              // if (uniqueLabels.length > 0) {
              //   for (let k in labelIndices) {
              //     if (k === firstValue) {
              //       const l = labelIndices[k].length - 1;
              //       const a = labelIndices[k][0];
              //       const b = labelIndices[k][l];
              //       if (index === a || index === b) {
              //         if (k?.length > 8) {
              //           k = k.substring(0, 8) + '...';
              //         }
              //         return k;
              //       } else {
              //         return '';
              //       }
              //     }
              //   }
              // } else {
              if (firstValue?.length > 8) {
                firstValue = firstValue.substring(0, 8) + '...';
              }
              return firstValue;
              // }
            },
          },
        };
      }
    }
    return scales;
  };
  // generate dynamic Scales for y.
  const handleYScales = (yName: string) => {
    return {
      y: {
        position: 'left',

        afterFit: function (scaleInstance: any) {
          scaleInstance.width = 100; // sets the width to 100pxss
        },
        beginAtZero: true,
        stacked: true,
        // For grid lines on graph
        grid: {
          display: true,
        },
        ticks: {
          display: true,
          font: {
            weight: 'bold',
            size: 10, // Change the font size here
          },
        },
        // axis lable values
        title: {
          display: true,
          text: yName,
        },
      },
    };
  };

  const handleTopBottomOptions = (yName: string, position: string) => {
    const scaleXValues = handelXScales(position);
    const scaleYValues = handleYScales(yName);

    const scaleValues = { ...scaleXValues, ...scaleYValues };

    return {
      indexAxis: 'x',
      plugins: {
        title: {
          display: false,
          text: 'Chart.js Bar Chart - Stacked',
        },
        legend: {
          display: false,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false, // to show tooltip on hover of col
      },
      scales: scaleValues, // generate dynamically
    };
  };

  const handleMidleOption = (yName: string) => {
    return {
      indexAxis: 'x',
      plugins: {
        title: {
          display: false,
          text: 'Chart.js Bar Chart - Stacked',
        },
        legend: {
          display: false,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      scales: {
        x: {
          stacked: true,
          type: 'category',
          grid: {
            display: true,
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },

          // For labels
          ticks: {
            display: false,
          },
        },
        y: {
          position: 'left',
          // min: -15,
          // max: 15,
          // stepSize: 5,
          afterFit: function (scaleInstance: any) {
            scaleInstance.width = 100; // sets the width to 100pxss
          },
          beginAtZero: true,
          stacked: true,
          // For grid lines on graph
          grid: {
            display: true,
          },
          ticks: {
            display: true,
            font: {
              weight: 'bold',
              size: 10, // Change the font size here
            },
          },
          // axis lable values
          title: {
            display: true,
            text: yName,
          },
        },
      },
    };
  };

  const getDataValue = (key: string) => {
    let dataSetVaue: unknown[] = [];

    dataForCharts.map((item: {}) => {
      if (Object.keys(item)[0] === key) {
        dataSetVaue.push(Object.values(item)[0]);
      }
    });
    return dataSetVaue;
  };

  const handleChartDataSet = (name: string, position: string) => {
    let a = getDataValue(name);

    return {
      labels,
      datasets: [
        {
          label: name, // Tooltip lable
          data: a[0],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          stack: 'Stack 0',
          barThickness: barWidth,
        },
      ],
    };
  };

  const handleRender = () => {
    return yAxisUnitNames.map((item, i) => {
      if (i === 0) {
        return (
          <Bar
            options={handleTopBottomOptions(item, 'top')}
            data={handleChartDataSet(item, 'top')}
            // style={{ marginTop: '600px' }}
          />
        );
      } else if (i !== 0 && i < yAxisCounts - 1) {
        return (
          <Bar
            // height={height - 50}
            // width={width}
            options={handleMidleOption(item)}
            data={handleChartDataSet(item, 'mid')}
          />
        );
      } else if (i === yAxisCounts - 1) {
        return (
          // <div style={{ marginTop: height * 0.03 }}>
          <Bar
            options={handleTopBottomOptions(item, 'bottom')}
            data={handleChartDataSet(item, 'bottom')}
            // height={height}
            // width={width}
            // style={{ marginBottom: '50px' }}
          />
          // </div>
        );
      }
    });
  };

  // for manging the bar & chart size as per the data size
  useEffect(() => {
    setLabelsCount(finalResult?.cols?.length);
    if (data?.length < 100) {
      setTotalWidth(width);
      setBarWidth(15);
    } else if (data?.length >= 100 && data?.length <= 1000) {
      const a = data?.length * 15;
      setTotalWidth(a);
      setBarWidth(15);
    } else if (data?.length > 1000) {
      const a = data?.length * 5;
      setTotalWidth(a);
      setBarWidth(5);
    }
  }, [data, setTotalWidth]);

  return (
    <div
      className="chart-container"
      style={{
        width: totalWidth,
        height: height,
        overflowX: 'auto',
      }}
    >
      <h3>{props.headerText}</h3>
      {handleRender()}
    </div>
  );
}
