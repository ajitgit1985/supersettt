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
import React, { useEffect, createRef, useState } from 'react';
import {
  getNumberFormatter,
  getSequentialSchemeRegistry,
  CategoricalColorNamespace,
  NumberFormatter,
} from '@superset-ui/core';

import {
  SupersetPluginChartBarchartProps,
  SupersetPluginChartBarchartStylesProps,
} from './types';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import {
  getMapedColors,
  getUniqueValues,
  removeDataByCols,
  handleFilterData,
} from '../helpingMethoads/methods';

import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

import { useSetAtom } from 'jotai';

/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */

export default function SupersetPluginChartBarchart(
  props: SupersetPluginChartBarchartProps,
) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  const { data, height, width, colorScheme } = props;

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

  // console.log('data values orignal data ', data);

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
  // for ['color_scheme']
  const linearColorScale = CategoricalColorNamespace.getScale(colorScheme);

  const matricsValues: any = data[0].metrics;

  const mapedColorsValues = getMapedColors(linearColorScale, matricsValues);

  // ************ End ************* To get the linear color values which is selected from the control panel

  // ************* Start ************* unique values as per col values.
  const secondDataCriteria = finalResult.cols;
  const values = getUniqueValues(data, secondDataCriteria);
  // ************* End ************* unique values as per col values

  // ************* Start ************* values for the y axis

  const a = finalResult?.data;
  // console.log("color",a);

  // To reach the last child in filtered data
  const { mData, mapLabels } = handleFilterData(a, finalResult?.cols);

  const filteredUnitData = removeDataByCols(mData, finalResult.cols);
  // ************* End ************* values for the y axis

  // ************* Create Lables as per the cols *************

  // To know how many chart will be created (means y-axis)
  const yAxisCounts = Object.entries(filteredUnitData[0])?.length; // For Numbers of Charts
  const yAxisUnitNames = Object.keys(filteredUnitData[0]);

  // const sortedData = filteredUnitData.sort((a, b) => {
  //   // Assuming your data structure has a property 'value', modify as needed
  //   const valueA = a.value;
  //   const valueB = b.value;

  //   // Sort in descending order
  //   return valueB - valueA;
  // });

  // // For Chart data
  // const dataForCharts = sortedData.reduce((acc: any, obj: any) => {
  //   Object.keys(obj).forEach(key => {
  //     const existing = acc.find((item: any) => Object.keys(item)[0] === key);
  //     if (!existing) {
  //       acc.push({ [key]: [obj[key]] });
  //     } else {
  //       existing[key].push(obj[key]);
  //     }
  //   });
  //   return acc;
  // }, []);

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

  console.log('data for chart ', filteredUnitData);

  // ==================================================================

  const labels = mapLabels;

  const colorsValue = ['green', 'red', 'blue'];

  const barChartData = {
    labels: labels, // Y-axis
    datasets: dataForCharts.map((item: any, index: number) => {
      const key = Object.keys(item)[0];
      const countData = item[key].length;

      return {
        label: key, // Legend label
        data: item[key], // X-axis data
        backgroundColor: item[key].map((item1, i) => {
          const groupIndex = Math.floor(i / (countData / 3));
          return colorsValue[groupIndex % colorsValue.length];
        }),
        borderWidth: 1,
      };
    }),
  };

  const options = {
    scales: {
      x: {
        stacked: false, // Set to false for clustered bars
      },
      y: {
        stacked: false, // Set to false for clustered bars
      },
    },
  };

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

      <Bar data={barChartData} options={options} />
    </div>
  );
}
