import React, { useEffect, createRef, useRef, useState } from 'react';
import { styled } from '@superset-ui/core';
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
  padding: ${({ theme }) => theme.gridUnit * 4}px;
  border-radius: ${({ theme }) => theme.gridUnit * 2}px;
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;

  h3 {
    /* You can use your props to control CSS! */
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.gridUnit * 3}px;
    font-size: ${({ theme, headerFontSize }) =>
      theme.typography.sizes[headerFontSize]}px;
    font-weight: ${({ theme, boldText }) =>
      theme.typography.weights[boldText ? 'bold' : 'normal']};
  }

  pre {
    height: ${({ theme, headerFontSize, height }) =>
      height - theme.gridUnit * 12 - theme.typography.sizes[headerFontSize]}px;
  }
`;

export default function SupersetPluginChartBignumberLine(
  props: SupersetPluginChartBignumberLineProps,
) {
  const { data, height, width, numberFormatter, errorMSG, columns, metrics } =
    props;

  const chartRef = useRef();
  useEffect(() => {
    console.log({ chartRef });
    if (chartRef.current) {
    }
  }, []);

  const containerRef = useRef(null);
  const isFilterSelectedOnDashboard = useAtomValue(dashboardFilterSelected);
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

    // Handle the case where either yearA or yearB is undefined
    return 0;
  });
  // .slice(0, 2);

  // Default two values and applying filters from dashboard with
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

  const colValues = getColValues(dataValue, columns[0]);
  const metricsValues = getMetricsValues(dataValue, metricsData);

  console.log('sortDatavalue', dataValue, metrics[0], metricsData);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top' as const,
      },
      title: {
        display: false,
        text: 'Chart.js Line Chart',
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
          display: false,
        },
      },
    },
  };

  const labels = colValues;

  const data1 = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Dataset 2',
        data: metricsValues,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'red',
      },
    ],
  };

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
                            fontWeight: 500,
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
            data={data1}
          />
        </>
      )}
    </Styles>
  );
}
