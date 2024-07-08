import React, { useEffect, useState } from 'react';
import { CategoricalColorNamespace } from '@superset-ui/core';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { SupersetPluginChartHellowWorldNewProps } from './types';
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

import {
  removeDataByCols,
  handleFilterData,
  numbersCount,
  powNumbers,
  handleRoundingValues,
  getMaxScaleValue,
} from '../../helpingMethoads/methods';

import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function SupersetPluginChartHellowWorldNew(
  props: SupersetPluginChartHellowWorldNewProps,
) {
  const {
    data,
    height,
    width,
    colorScheme,
    numberFormatter,
    show_values,
    isDataLabelsVerticallyAlign,
  } = props;

  const [labelsCount, setLabelsCount] = useState<number>();
  const [totalWidth, setTotalWidth] = useState<any>(width);
  const [barWidth, setBarWidth] = useState(15);

  const newData = data?.map(item => {
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

  const inputData = newData;

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
    new Set(inputData?.reduce((acc, item) => acc.concat(item.cols), [])),
  );

  // for list of unique cols values:
  const structuredData = generateStructure(inputData, uniqueCols);
  const result = generateResult(inputData, structuredData, uniqueCols);

  const sortObject = (obj: any): any => {
    if (obj instanceof Array) {
      return obj.map(sortObject);
    } else if (obj instanceof Object) {
      return Object.keys(obj)
        .sort()
        .reduce((sorted: any, key: any) => {
          sorted[key] = sortObject(obj[key]);
          return sorted;
        }, {});
    }
    return obj;
  };

  const sortedData = sortObject(result);

  const finalResult = {
    cols: uniqueCols,
    data: sortedData,
  };

  // ************ End ************* data grouping as per cols values

  // ************ Start ************* To get the linear color values which is selected from the control panel

  // for ['linear_color_scheme'],
  // const linearColorScale = getSequentialSchemeRegistry().get(colorScheme);

  // for ['color_scheme']
  const linearColorScale = CategoricalColorNamespace.getScale(colorScheme);

  // const matricsValues: any = data[0].metrics;

  // const mapedColorsValues = getMapedColors(linearColorScale, matricsValues);

  // ************ End ************* To get the linear color values which is selected from the control panel

  // ************* Start ************* unique values as per col values.
  // const secondDataCriteria = finalResult.cols;
  // const values = getUniqueValues(data, secondDataCriteria);
  // ************* End ************* unique values as per col values

  // ************* Start ************* values for the y axis

  const a = finalResult?.data;

  // To reach the last child in filtered data
  const { mData, mapLabels } = handleFilterData(a, finalResult?.cols);

  const filteredUnitData = removeDataByCols(mData, finalResult.cols);
  // ************* End ************* values for the y axis

  // ************* Create Lables as per the cols *************

  // To know how many chart will be created (means y-axis)
  const yAxisCounts = Object.entries(filteredUnitData[0])?.length; // For Numbers of Charts
  const yAxisUnitNames = Object.keys(filteredUnitData[0]);
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
          position: yAxisUnitNames?.length === 1 ? 'bottom' : position, // assuming position is defined somewhere
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
            maxRotation: 45,
            minRotation: 45,
            callback: function (this: any, label: string) {
              let realLabel: string = this.getLabelForValue(label);
              var firstValue1 = realLabel?.split(';')[i];
              var firstValue = realLabel?.split(';')[i];

              if (firstValue1?.includes('(')) {
                firstValue1 = firstValue1?.replace(/\([^)]*\)/, '');
              }

              return firstValue1;
            },
          },
        };
      }
    }
    return scales;
  };

  // generate dynamic Scales for y.
  const handleYScales = (yName: string) => {
    const a = getDataValue(yName);
    const maxSalValue = getMaxScaleValue(a, isDataLabelsVerticallyAlign);

    return {
      y: {
        // reversed: true,
        max: maxSalValue,
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
        scaleLabel: {
          display: true,
          labelString: 'Custom Y-Axis Label',
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
      layout: {},
      indexAxis: 'x' as const,

      plugins: {
        // plugin added for showing the vlaues on the top of the bars with units
        datalabels: {
          // color: '#000',
          anchor: 'end' as const,
          rotation: isDataLabelsVerticallyAlign ? -90 : 0,
          align: isDataLabelsVerticallyAlign ? -90 : ('end' as const),
          font: {
            size: 10,
            weight: 'bold' as const,
          },

          formatter: (value: any) => {
            const text = numberFormatter(value);
            return text;
          },
        },
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
      indexAxis: 'x' as const,
      plugins: {
        // plugin added for showing the vlaues on the top of the bars with units
        datalabels: {
          anchor: 'end' as const,
          align: 'end' as const,
          font: {
            size: 12,
          },
          formatter: (value: any) => {
            const text = numberFormatter(value);
            return text;
          },
        },
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
          type: 'category' as const,
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
          position: 'left' as const,
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
              weight: 'bold' as const,
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

  const numColors = linearColorScale.colors.length;

  Object.keys(sortedData).forEach((year, index) => {
    const colorIndex = index % numColors; // Cycle through available colors
    sortedData[year].color = linearColorScale.colors[colorIndex];
  });

  const colorMapping = (labels: any) => {
    const colors = labels.map((label: any) => {
      const lowerCaseLabel = label.toLowerCase();
      const matchingKey = Object.keys(sortedData).find(key =>
        lowerCaseLabel.includes(key.toLowerCase()),
      );
      if (matchingKey) {
        return sortedData[matchingKey].color;
      }
      return null; // Return something for non-matching labels
    });
    return colors;
  };

  const handleChartDataSet = (name: string) => {
    let a = getDataValue(name);
    // const value = getColor(name);
    return {
      labels,
      datasets: [
        {
          label: name, // Tooltip lable
          data: a[0],
          backgroundColor: colorMapping(labels),
          stack: 'Stack 0',
          barThickness: barWidth,
        },
      ],
    };
  };

  const handleRender = () => {
    return (
      <div
        style={{
          width: totalWidth,
          height: height + 100,
          paddingBottom: 50,
        }}
      >
        {yAxisUnitNames.map((item, i) => {
          if (i === 0) {
            return (
              <Bar
                options={handleTopBottomOptions(item, 'top')}
                data={handleChartDataSet(item)}
                plugins={show_values ? [ChartDataLabels] : []}
              />
            );
          } else if (i !== 0 && i < yAxisCounts - 1) {
            return (
              <Bar
                options={handleMidleOption(item)}
                data={handleChartDataSet(item)}
                plugins={show_values ? [ChartDataLabels] : []}
              />
            );
          } else if (i === yAxisCounts - 1) {
            return (
              // <div style={{ marginTop: height * 0.03 }}>
              <Bar
                options={handleTopBottomOptions(item, 'bottom')}
                data={handleChartDataSet(item)}
                plugins={show_values ? [ChartDataLabels] : []}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
    );
  };

  // for manging the bar & chart size as per the data size
  useEffect(() => {
    setLabelsCount(finalResult?.cols?.length);
    if (data?.length < 50) {
      setTotalWidth(width);
      setBarWidth(20);
    } else if (data?.length >= 50 && data?.length <= 100) {
      setTotalWidth(width);
      setBarWidth(10);
    } else if (data?.length >= 100 && data?.length <= 1000) {
      const a = data?.length * 15;
      setTotalWidth(a);
      setBarWidth(10);
    } else if (data?.length > 1000) {
      const a = data?.length * 10;
      setTotalWidth(a);
      setBarWidth(2);
    }
  }, [data, setTotalWidth]);

  return (
    <div
      className="chart-container"
      style={{
        width: width,
        height: height,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h4>{props.headerText}</h4>
      </div>
      {Object.keys(sortedData)?.length > 1 ? (
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {Object.keys(sortedData).map((item, index) => {
            return Object.values(sortedData)?.map((color: any, i: any) => {
              if (i === index) {
                return (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginBottom: 5,
                    }}
                  >
                    <text
                      style={{
                        fontSize: 10,
                        fontWeight: 'bold',
                        color: '#5b5757',
                      }}
                    >
                      {item}:
                    </text>
                    <div
                      style={{
                        backgroundColor: color.color,
                        width: 15,
                        height: 10,
                        marginLeft: 3,
                        marginRight: 12,
                      }}
                    ></div>
                  </div>
                );
              }
            });
          })}
        </div>
      ) : null}
      <div
        style={{
          width: width,
          height: height - 80,
          overflow: 'auto',
        }}
      >
        {handleRender()}
      </div>
    </div>
  );
}
