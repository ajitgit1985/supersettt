import React, { useEffect, createRef, useRef, useState } from 'react';
import { styled, CategoricalColorNamespace } from '@superset-ui/core';
import {
  SupersetPluginChartBignumberLineProps,
  SupersetPluginChartBignumberLineStylesProps,
} from './types';
import { useAtomValue } from 'jotai';
import { dashboardFilterSelected } from 'src/views/atoms';
import { Line } from 'react-chartjs-2';
import errorMsgCard from '../../customComponents/errorMsgCard';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

const Styles = styled.div<SupersetPluginChartBignumberLineStylesProps>`
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

export default function SupersetPluginChartBignumberLine(
  props: SupersetPluginChartBignumberLineProps,
) {
  const {
    data,
    height,
    width,
    numberFormatter,
    errorMSG,
    columns,
    metrics,
    colorScheme,
  } = props;

  const chartRef = useRef();
  useEffect(() => {
    console.log({ chartRef });
    if (chartRef.current) {
    }
  }, []);

  const containerRef = useRef(null);
  const isFilterSelectedOnDashboard = useAtomValue(dashboardFilterSelected);
  const colorScale = CategoricalColorNamespace.getScale(colorScheme);

  const xsmall = `${Math.min(width / 2, height / 2) * 0.01}px`;
  const small = `${Math.min(width / 2, height / 2) * 0.1}px`;
  const meadium = `${Math.min(width / 2, height / 2) * 0.15}px`;
  const large = `${Math.min(width / 2, height / 2) * 0.2}px`;

  const sortedData = [...data]?.sort((a, b) => {
    const yearA = a?.quarter_year?.split(' ')[1];
    const yearB = b?.quarter_year?.split(' ')[1];
    const quarterA = a?.quarter_year?.split('Q')[1].split('(')[0];
    const quarterB = b?.quarter_year?.split('Q')[1].split('(')[0];
    if (yearA && yearB) {
      if (yearA === yearB) {
        return quarterB.localeCompare(quarterA);
      }
      return yearB.localeCompare(yearA);
    }
    return 0;
  });

  let dataValue;

  if (isFilterSelectedOnDashboard) {
    dataValue = sortedData;
  } else {
    dataValue = sortedData.slice(0, 2);
  }

  const getColValues = (data: any, key: any) => {
    return data.map((item: any) => item[key]);
  };

  const getMetricsValues = (data: any, key: any) => {
    return data.map((item: any) => item[key]);
  };

  let metricsData;
  if (typeof metrics[0] === 'object') {
    metricsData = metrics[0].label;
  } else {
    metricsData = metrics[0];
  }

  const newData = sortedData?.map(item => {
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

  const colValues = getColValues(newData, columns[0]);
  const metricsValues = getMetricsValues(newData, metricsData);

  console.log('sortDatavalue', colValues);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            if (tooltipItem.formattedValue !== 'NaN') {
              let numberWithoutCommas = tooltipItem.formattedValue.replace(
                /,/g,
                '',
                10,
              );
              const text = numberFormatter(numberWithoutCommas);
              return text;
            } else {
              const text = tooltipItem.raw;
              return text;
            }
          },
        },
      },
    },
    maintainAspectRatio: true,
    interaction: {
      mode: 'index' as const,
      intersect: false, // to show tooltip on hover
    },
    scales: {
      x: {
        stacked: true,
        type: 'category' as const,
        grid: {
          display: false,
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
        // For labels
        ticks: {
          display: false,
        },
      },
      y: {
        position: 'left' as const,
        beginAtZero: true,
        stacked: true,
        // For grid lines on graph
        grid: {
          display: false,
        },
        ticks: {
          callback: function (value: any) {
            const text = numberFormatter(value);
            return text;
          },
          display: false,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const getRandomColors = (count: number) => {
    const fixedRandomColors = colorScale.colors;
    if (count <= fixedRandomColors.length) {
      return fixedRandomColors.slice(0, count);
    } else {
      const additionalColors: string[] = [];
      for (let i = 0; i < count; i++) {
        additionalColors.push(fixedRandomColors[i % fixedRandomColors.length]);
      }
      return additionalColors;
    }
  };
  const borderColour = getRandomColors(2);

  return (
    <Styles boldText={props.boldText} height={height} width={width}>
      {errorMSG ? (
        errorMsgCard(errorMSG)
      ) : (
        <>
          <div
            ref={containerRef}
            style={{
              overflowY: 'auto',
              height: height / 2.2,
              width: width - 30,
              marginBottom: '14px',
            }}
          >
            {dataValue.map((item, index) => {
              const rev = Object.values(item).reverse();
              return rev.map((value, i) => {
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                    }}
                  >
                    {typeof value === 'number' ? (
                      <div>
                        <text
                          style={{
                            fontWeight: 700,
                            fontSize: index == 0 ? large : meadium,
                          }}
                        >
                          {numberFormatter(value)}
                        </text>
                      </div>
                    ) : (
                      <div
                        style={{
                          paddingBottom:
                            index == 0 && value !== null ? xsmall : 0,
                        }}
                      >
                        {value === null ? (
                          <text
                            style={{ fontWeight: 'bold', fontSize: meadium }}
                          >
                            N/A
                          </text>
                        ) : (
                          <text style={{ fontSize: small, fontWeight: 500 }}>
                            {value}
                          </text>
                        )}
                      </div>
                    )}
                  </div>
                );
              });
            })}
          </div>
          <Line
            width={width}
            height={height / 2}
            ref={chartRef}
            options={options}
            data={{
              labels: colValues,
              datasets: [
                {
                  fill: true,
                  data: metricsValues,
                  borderColor: borderColour[1],
                  backgroundColor: getRandomColors(1),
                  pointHoverRadius: 8,
                  pointHoverBackgroundColor: borderColour[1],
                },
              ],
            }}
          />
        </>
      )}
    </Styles>
  );
}
