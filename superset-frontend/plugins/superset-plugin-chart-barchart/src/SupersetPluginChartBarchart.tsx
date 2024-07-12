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

  const [totalWidth, setTotalWidth] = useState<any>(width);
  const [labelsCount, setLabelsCount] = useState<number>();
  const [barWidth, setBarWidth] = useState(15);

  const rootElem = createRef<HTMLDivElement>();

  // Often, you just want to access the DOM and do whatever you want.
  // Here, you can do that with createRef, and the useEffect hook.
  useEffect(() => {
    const root = rootElem.current as HTMLElement;
  });

  // const [a1,setA]=useState<Array>([])
  // const [b,setB]=useState<Array>([])
  let a1 = [];
  let b: any[] = [];
  const metricsValues = data[0].metrics;

  // Function to dynamically sort data based on a metric
  const sortDataByMetric = (metric: any) => {
    return [...data].sort((a, b) => b[metric] - a[metric]);
  };

  // Sorting the data based on the count (default behavior)

  metricsValues.map((item: any) => {
    if (typeof item === 'string') {
      const sortedData = sortDataByMetric(item);
      a1 = sortedData;
    } else {
      const sortedData = sortDataByMetric(item.label);
      // setB(sortedData)
      b = sortedData;
    }
  });

  const inputData = b;

  console.log('data value: ', inputData);
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
  // const linearColorScale = CategoricalColorNamespace.getScale(colorScheme);

  // const matricsValues: any = data[0].metrics;

  // const mapedColorsValues = getMapedColors(linearColorScale, matricsValues);
  // console.log("mapedColorsValues",mapedColorsValues);

  // ************ End ************* To get the linear color values which is selected from the control panel

  // // ************* Start ************* unique values as per col values.
  // const secondDataCriteria = finalResult.cols;
  // const values = getUniqueValues(data, secondDataCriteria);
  // // ************* End ************* unique values as per col values

  // ************* Start ************* values for the y axis

  const a = finalResult?.data;

  // console.log(a);

  // const dataArray = Object.entries(data);

  // To reach the last child in filtered data
  const { mData, mapLabels } = handleFilterData(a, finalResult?.cols);
  // console.log("color",mapLabels);

  const filteredUnitData = removeDataByCols(mData, finalResult.cols);
  // console.log("filteredUnitData",filteredUnitData);

  // ************* End ************* values for the y axis

  // // ************* Create Lables as per the cols *************

  // // To know how many chart will be created (means y-axis)
  // const yAxisCounts = Object.entries(filteredUnitData[0])?.length; // For Numbers of Charts
  // const yAxisUnitNames = Object.keys(filteredUnitData[0]);

  // // For Chart data
  // const dataForCharts = filteredUnitData.reduce((acc: any, obj: any) => {
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

  // console.log("source data",labels,"Data chart",dataForCharts);

  const labels = mapLabels;
  // Max to min sorting
  const dataForCharts = filteredUnitData.reduce((acc: any, obj: any) => {
    Object.keys(obj).forEach(key => {
      const existing = acc.find((item: any) => Object.keys(item)[0] === key);

      if (!existing) {
        acc.push({ [key]: [obj[key]] });
      } else {
        existing[key].push(obj[key]);
        // existing[key].sort((a, b) => b - a); // Sort values for the current key in descending order
      }
    });

    return acc;
  }, []);

  // const labels = mapLabels;

  // console.log("dataForCharts",labels);
  // console.log("dataForCharts",dataForCharts);

  // ==================================================================

  // const label = mapLabels;
  // // console.log("labels",labels);

  // const labels = label.slice().sort((a, b) => a.localeCompare(b));

  // const labels = mapLabels;
  // console.log("labels",labels);

  // const labels = label.slice().sort((a, b) => a.localeCompare(b));

  // const colorsValue = ['#20a7c9', '#363062', '#E55604'];
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
        barThickness: barWidth,
      };
    }),
  };

  // console.log("dataset", barChartData);

  const options = {
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
    scales: {
      x: {
        stacked: false, // Set to false for clustered bars
      },
      y: {
        stacked: false, // Set to false for clustered bars
      },
    },
  };

  // for manging the bar & chart size as per the data size
  useEffect(() => {
    setLabelsCount(finalResult?.cols?.length);
    if (data?.length <= 10) {
      setTotalWidth(width);
      setBarWidth(50);
    }
    if (data?.length <= 100 && data?.length > 10) {
      setTotalWidth(width);
      setBarWidth(15);
    } else if (data?.length > 100 && data?.length <= 1000) {
      const a = data?.length * 15;
      setTotalWidth(a);
      setBarWidth(15);
    } else if (data?.length > 1000) {
      const a = data?.length * 5;
      setTotalWidth(a);
      setBarWidth(5);
    }
  }, [data, setTotalWidth, setBarWidth]);
  // console.log("total",data);

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
