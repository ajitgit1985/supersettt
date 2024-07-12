import React, { useEffect, createRef } from 'react';
import {
  styled,
  getSequentialSchemeRegistry,
  CategoricalColorNamespace,
} from '@superset-ui/core';
import {
  SupersetPluginChartHelloWorldProps,
  SupersetPluginChartHelloWorldStylesProps,
} from './types';
// import { Bar } from 'react-chartjs-2';
import '@kurkle/color';

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

import React, { useRef, useState } from 'react';
// import { Chart, ChartActiveElement } from 'chart.js/auto'; // Check the correct path for your Chart.js library

const Styles = styled.div<SupersetPluginChartHelloWorldStylesProps>`
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

interface SupersetPluginChartHelloWorldProps {
  data: any[]; // Assuming your data is an array of objects
  height: number;
  width: number;
  boldText: string;
  headerFontSize: number;
  // linearColorScheme:any;
  colorScheme: any;
}

const SupersetPluginChartHelloWorld: React.FC<SupersetPluginChartHelloWorldProps> =
  props => {
    // const { data, height, width,linearColorScheme } = props;
    const { data, height, width, colorScheme } = props;

    // const [totalWidth, setTotalWidth] = useState<any>(width);
    // const [barWidth, setBarWidth] = useState(15);

    const columns = [
      'Year',
      'srcYear',
      'Gender',
      'month',
      'BlockName',
      'new_month',
      'country_name',
      'country',
      'city_name',
      'village_name',
      'village',
      'Village',
      'date',
      'Date',
      'state_name',
      'srcStateName',
      'srcDistrictName',
      'StateName',
      'DistrictName',
      'district_name',
      'District',
      'district',
      'State',
      'state',
    ];
    const state_data = [
      'state_name',
      'srcStateName',
      'StateName',
      'State',
      'state',
    ];
    const district_data = [
      'srcDistrictName',
      'DistrictName',
      'district_name',
      'District',
      'district',
    ];

    const stateWiseCounts = {};
    data.forEach(item => {
      // const state = item.srcStateName;
      const stateKey = state_data.find(key => item[key] !== undefined);
      const state = item[stateKey!] || '';

      const gender = item.Gender;

      if (!stateWiseCounts[state]) {
        stateWiseCounts[state] = { Male: 0, Female: 0 };
      }

      if (gender === 'Male') {
        stateWiseCounts[state].Male++;
      } else if (gender === 'Female') {
        stateWiseCounts[state].Female++;
      }
    });

    const colorScale = CategoricalColorNamespace.getScale(colorScheme);
    // console.log("colorScale",colorScale.colors);

    const rootElem = useRef<HTMLDivElement>(null);
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [showAllStates, setShowAllStates] = useState<boolean>(false);
    const [selectedDistrictData, setSelectedDistrictData] = useState<any[]>([]);
    const [isStateSelected, setIsStateSelected] = useState<boolean>(false);
    const [singleStateSelectedOnclick, setSingleStateSelectedOnclick] =
      useState<string>('');

    const [indexAxis, setIndexAxis] = useState<'x' | 'y'>('y'); // Default value 'y'
    const axisLabel = indexAxis === 'y' ? 'Vertical' : 'Horizontal';

    const dynamicKeys = Object.keys(data[0]).filter(
      key =>
        !columns.includes(key) &&
        !state_data.includes(key) &&
        !district_data.includes(key),
    );

    const isDistSelected = Object.keys(data[0]).some(key =>
      district_data.includes(key),
    );

    const stateData = data.reduce((acc, item) => {
      const stateKey = state_data.find(key => item[key]);
      const state = item[stateKey!];
      if (!acc[state]) {
        acc[state] = 0;
      }
      dynamicKeys.forEach(dynamicKey => {
        acc[state] += item[dynamicKey]; // Using dynamicKey here
      });
      return acc;
    }, {});

    const handleAxisToggle = () => {
      const newIndexAxis = indexAxis === 'y' ? 'x' : 'y';
      setIndexAxis(newIndexAxis);
    };

    const handleStateClick = (stateName: string) => {
      const selectedState = data.filter((item: any) => {
        return state_data.some(key => item[key] === stateName);
      });

      if (!isStateSelected && selectedState.length > 0) {
        setIsStateSelected(true);
        setSingleStateSelectedOnclick(stateName);
        setSelectedDistrictData(selectedState);
      }
    };

    const handleBackClick = () => {
      setSelectedState(null);
      setShowAllStates(false);
      setIsStateSelected(false);
      setSelectedDistrictData([]);
    };

    const handleShowAllStates = () => {
      setShowAllStates(true);
      setSelectedState(null);
      setSelectedDistrictData([]);
    };

    const getRandomColors = (count: number) => {
      const fixedRandomColors = colorScale.colors;
      if (count <= fixedRandomColors.length) {
        return fixedRandomColors.slice(0, count);
      } else {
        const additionalColors: string[] = [];
        for (let i = 0; i < count; i++) {
          additionalColors.push(
            fixedRandomColors[i % fixedRandomColors.length],
          );
        }
        return additionalColors;
      }
    };

    const handleChartClick = (evt: MouseEvent, activeElements: any[]) => {
      if (activeElements.length > 0 && activeElements[0].datasetIndex === 0) {
        const clickedIndex = activeElements[0].index;
        const clickedState = chartData.labels[clickedIndex];

        const selectedStateData = data.find((item: any) => {
          const stateKey = state_data.find(key => item[key] !== undefined);
          const districtKey = district_data.find(
            key => item[key] !== undefined,
          );

          return (
            item[stateKey!] === clickedState &&
            item[districtKey!] &&
            !showAllStates
          );
        });

        if (selectedStateData) {
          handleStateClick(clickedState);
        }
      }
    };

    // Get all state data
    const allStateData = Object.keys(stateData);

    // Sort states alphabetically
    const sortedStates = Object.keys(stateData).sort((a, b) =>
      a.localeCompare(b, 'en', { sensitivity: 'base' }),
    );

    // Generate random colors for dynamic keys
    const dynamicKeyColors: { [key: string]: string[] } = {};

    dynamicKeys.forEach(key => {
      dynamicKeyColors[key] = getRandomColors(allStateData.length);
    });

    const fixedColors = [
      '#20a7c9', // skyBlue
      '#363062', // voilate
      '#E55604', // orange
      '#6ECCAF', // green
    ];

    const renderAllStates = () => {
      return sortedStates.map((state: string) => {
        const districtData = data.filter((item: any) => {
          const stateKey = state_data.find(key => item[key] !== undefined);
          return item[stateKey!] === state; // Check both properties for the state
        });

        const sortedDistricts = districtData.sort((a, b) => {
          const districtKeyA = district_data.find(key => a[key] !== undefined);
          const districtKeyB = district_data.find(key => b[key] !== undefined);

          return (a[districtKeyA!] || '').localeCompare(
            b[districtKeyB!] || '',
            'en',
            { sensitivity: 'base' },
          );
        });
        let barWidth: any = [];
        if (sortedDistricts?.length <= 10) {
          barWidth = 50;
        }
        if (sortedDistricts?.length <= 50 && sortedDistricts?.length > 10) {
          barWidth = 10;
        } else if (sortedDistricts?.length > 50) {
          barWidth = 8;
        }

        const districtChartData = {
          labels: sortedDistricts.map((item: any) => {
            const districtKey = district_data.find(
              key => item[key] !== undefined,
            );
            return item[districtKey!] || '';
          }),
          datasets: dynamicKeys.map((key, index) => ({
            label: key,
            data: sortedDistricts.map((item: any) => item[key]),
            backgroundColor: fixedColors[index % fixedColors.length],
            borderColor: 'white',
            borderWidth: 1,
            barThickness: barWidth,
          })),
        };

        return (
          <div key={state}>
            <h6>{state}</h6>
            <Bar data={districtChartData} options={chartOptions} />
          </div>
        );
      });
    };

    const dynamicDatasetsForBar = dynamicKeys.map((key, index) => ({
      label: key,
      data: selectedDistrictData.map((item: any) => item[key]),
      // backgroundColor: dynamicKeyColors[key][index], // Assign unique color to each key
      backgroundColor: fixedColors[index % fixedColors.length], // Use colors in a loop
      // borderColor: dynamicKeyColors[key][index],
      borderColor: fixedColors[index % fixedColors.length],
      borderWidth: 1,
    }));

    const chartData = {
      labels: sortedStates,
      datasets: [
        {
          label: 'States Data',
          data: sortedStates.map(state => stateData[state]),
          backgroundColor: getRandomColors(sortedStates.length),
          borderColor: 'white',
          borderWidth: 1,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      indexAxis: indexAxis,
      interaction: {
        mode: 'index' as const,
        intersect: indexAxis === 'y' ? true : false, // Dynamically set intersect based on indexAxis
      },
      scales: {
        y: {
          stacked: true,
          afterFit: function (scaleInstance: any) {
            scaleInstance.width = 170; // sets the width to 150px
          },
          grid: {
            display: false, // Remove grid lines
          },
          ticks: {
            display: true,
            beginAtZero: true,
            font: {
              size: 10,
              weight: 'bold',
            },
          },
        },

        x: {
          stacked: true,
          ticks: {
            display: true,
            beginAtZero: true,
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const state = context.label;
              const counts = stateWiseCounts[state];
              const maleCount = counts ? counts.Male : 0;
              const femaleCount = counts ? counts.Female : 0;

              if (maleCount > 1 || femaleCount > 1) {
                // Retrieve 'All State' data
                const allStateData = chartData.datasets[0].data;
                const allStateValue = allStateData[sortedStates.indexOf(state)];

                return `Gender: Male:${maleCount}, Female:${femaleCount}\n ${state}: ${allStateValue}`;
              }
            },
          },
        },
      },
      onClick: handleChartClick,
    };

    return (
      <Styles
        ref={rootElem}
        boldText={props.boldText}
        headerFontSize={props.headerFontSize}
        height={height}
        width={width}
        style={{ overflow: 'auto', padding: '50px' }}
      >
        <h3>{props.headerText}</h3>
        <div>
          <button onClick={handleAxisToggle}>{axisLabel}</button>
        </div>
        <br></br>
        <div>
          {showAllStates ? (
            <button onClick={handleBackClick} className="btn">
              <i className="fas fa-angle-double-up"></i>
            </button>
          ) : (
            <>
              {isStateSelected ? (
                <button className="btn" onClick={handleBackClick}>
                  <i className="fas fa-arrow-alt-circle-left"></i>
                </button>
              ) : (
                <>
                  {isDistSelected ? (
                    <button className="btn" onClick={handleShowAllStates}>
                      <i className="fas fa-angle-double-down"></i>
                    </button>
                  ) : null}
                </>
              )}
            </>
          )}
        </div>
        <div style={{ height, width: 'width-150px' }}>
          {showAllStates && !isStateSelected ? (
            <div>{renderAllStates()}</div>
          ) : (
            <div>
              {selectedState || isStateSelected ? (
                <div>
                  <h6>{selectedState}</h6>
                  {selectedDistrictData.length > 0 ? (
                    <>
                      <h6>{singleStateSelectedOnclick}</h6>
                      {/* {console.log("data1",data.length)} */}

                      <Bar
                        data={{
                          labels: selectedDistrictData.map((item: any) => {
                            const districtKey = district_data.find(
                              key => item[key] !== undefined,
                            );
                            return item[districtKey!] || '';
                          }),
                          datasets: dynamicDatasetsForBar,
                        }}
                        options={chartOptions}
                      />
                    </>
                  ) : (
                    <p>No district data available for this state</p>
                  )}
                </div>
              ) : (
                <>
                  <Bar data={chartData} options={chartOptions} />
                </>
              )}
            </div>
          )}
        </div>
      </Styles>
    );
  };

export default SupersetPluginChartHelloWorld;
