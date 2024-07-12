import { styled, CategoricalColorNamespace } from '@superset-ui/core';
import { SupersetPluginChartHierarchyStylesProps } from './types';
import '@kurkle/color';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import '../../styles.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import MetricsDropdown from 'plugins/helpingMethoads/metricsDropdown';
import { Bar } from 'react-chartjs-2';
import downIcon from '../src/images/down_icon.png';
import upIcon from '../src/images/up_icon.png';
import backIcon from '../src/images/back_icon.png';
import horizontalBarIcon from '../src/images/horizontal_bar.png';
import verticalBarIcon from '../src/images/vertical_bar.png';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

import React, { useEffect, useRef, useState } from 'react';
import {
  handleBarWidth,
  columns,
  state_data,
  district_data,
  quarterNames,
  getMaxScaleValue,
} from '../../helpingMethoads/methods';

import { FontSize, Size } from '../../helpingMethoads/ResponsiveUtils';
import { useAtomValue } from 'jotai';
import { dashboardFilterSelected } from 'src/views/atoms';

const Styles = styled.div<SupersetPluginChartHierarchyStylesProps>`
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

interface SupersetPluginChartHierarchyProps {
  data: any[];
  height: number;
  width: number;
  boldText: string;
  headerFontSize: number;
  numberFormatter: any;
  colorScheme: any;
}

const SupersetPluginChartHelloWorld: React.FC<SupersetPluginChartHierarchyProps> =
  (props: any) => {
    const {
      data,
      height,
      width,
      colorScheme,
      numberFormatter,
      show_values,
      formData,
      colsValues,
      currentQuarter,
      dataLabelsVerticalAlign,
      showChartFilter,
      finalYear,
    } = props;

    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [showAllStates, setShowAllStates] = useState<boolean>(false);
    const containerRef = useRef<any>(null);
    const [dataValue, setDataValue] = useState(data);
    const [selectedMetric, setSelectedMetric] = useState();

    const [convertedData, setConvertedData] = useState<any | null>([]);

    const [formDataValue, setFormDataValue] = useState(formData);
    const [selectedState, setSelectedState] = useState<string | null>(null);

    const isFilterSelectedOnDashboard = useAtomValue(dashboardFilterSelected);
    const quarterValue = colsValues.filter((item: any) =>
      quarterNames.includes(item),
    );

    const fontSize = FontSize(containerSize);
    const size = Size(containerSize);

    const colorScale = CategoricalColorNamespace.getScale(colorScheme);

    const [selectedDistrictData, setSelectedDistrictData] = useState<any[]>([]);
    const [isStateSelected, setIsStateSelected] = useState<boolean>(false);
    const [singleStateSelectedOnclick, setSingleStateSelectedOnclick] =
      useState<string>('');

    const [indexAxis, setIndexAxis] = useState<'x' | 'y'>('x'); // Default value 'y'
    const axisLabel = indexAxis === 'y' ? 'Vertical' : 'Horizontal';

    useEffect(() => {
      if (!showAllStates && selectedState === null) {
        const a1 = colsValues[0];
        if (quarterValue?.length > 0) {
          formData.cols = [a1, ...quarterValue];
        } else {
          formData.cols = [a1];
        }

        setFormDataValue(formData);
      } else {
        formData.cols = colsValues;
        setFormDataValue(formData);
      }
    }, [showAllStates, selectedState, showChartFilter]);

    const years = dataValue?.map((item: any) => {
      const regex = /\d{4}-\d{2}/;
      const match = item?.quarter_year?.match(regex);
      return match ? match[0] : null;
    });
    const uniqueYears = [
      ...new Set(years.filter((year: any) => year !== null)),
    ];

    useEffect(() => {
      const columnValue = formDataValue?.cols;
      const metricsValue = formDataValue?.metrics;
      // Create a set of allowed keys from columnsArray and labels from metricsArray
      const allowedKeys = new Set(columnValue);

      metricsValue.forEach((metric: any) => {
        if (typeof metric === 'string') {
          allowedKeys.add(metric);
        } else if (typeof metric === 'object') {
          allowedKeys.add(metric.label);
        }
      });

      // Function to clean up each object in the dataArray
      const cleanedDataArray = data.map((item: any) => {
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

      metricsValue.forEach((metric: any) => {
        const label = metric.label;
        const aggregate = metric.aggregate;
        aggregationMethods[label] = aggregate;
      });

      const resultMap = new Map();

      newData.forEach((entry: any) => {
        const dynamicKey = colsValues.map((key: any) => entry[key]).join('-');
        const dynamicValues: any = Object.keys(entry)
          .filter(key => !colsValues.includes(key))
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

      let a = resultArray;
      const colsLength = formData?.cols?.length;
      const lastCol = formData?.cols[colsLength - 1];
      if (
        colsLength > 1 &&
        !isFilterSelectedOnDashboard &&
        quarterValue?.length > 0
      ) {
        const sortedData = [...a]?.sort((a, b) => {
          const yearA = a?.quarter_year?.split(' ')[1];
          const yearB = b?.quarter_year?.split(' ')[1];
          const quarterA = a?.quarter_year?.split('Q')[1].split('(')[0];
          const quarterB = b?.quarter_year?.split('Q')[1].split('(')[0];
          if (yearA && yearB) {
            if (yearA === yearB) {
              return quarterB?.localeCompare(quarterA);
            }
            return yearB?.localeCompare(yearA);
          }
          return 0;
        });

        if (currentQuarter) {
          const uniqueValues = [
            ...new Set(sortedData?.map(item => item[lastCol])),
          ];

          const b = sortedData?.filter(
            item => item?.quarter_year === uniqueValues[0],
          );
          a = b;
        } else {
          a = sortedData;
        }
      }

      console.log('newData: ', a);

      setConvertedData(a);
      setDataValue(a);
    }, [
      showAllStates,
      selectedState,
      currentQuarter,
      formDataValue,
      showChartFilter,
      isStateSelected,
    ]);

    useEffect(() => {
      const updateContainerSize = () => {
        if (containerRef.current) {
          const { width, height } =
            containerRef.current.getBoundingClientRect();
          setContainerSize({ width, height });
        }
      };

      updateContainerSize();
      window.addEventListener('resize', updateContainerSize);

      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener('resize', updateContainerSize);
      };
    }, [width, height, dataValue, convertedData]);

    const dynamicKeys = Object.keys(dataValue[0]).filter(
      key =>
        !columns.includes(key) &&
        !state_data.includes(key) &&
        !district_data.includes(key) &&
        !quarterNames.includes(key),
    );

    const stateData = dataValue?.reduce((acc: any, item: any) => {
      const stateKey = state_data.find(key => item[key]);

      const state = item[stateKey!];

      if (!acc[state]) {
        acc[state] = 0;
      }
      dynamicKeys.forEach(dynamicKey => {
        acc[state] = item[dynamicKey]; // Using dynamicKey here
      });
      return acc;
    }, {});

    const handleAxisToggle = () => {
      const newIndexAxis = indexAxis === 'y' ? 'x' : 'y';
      setIndexAxis(newIndexAxis);
    };

    const handleStateClick = (stateName: string) => {
      const selectedState = convertedData?.filter((item: any) => {
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

    useEffect(() => {
      if (selectedState !== null) {
        const selectedStateData = convertedData?.find((item: any) => {
          const stateKey = state_data.find(key => item[key] !== undefined);
          const districtKey = district_data.find(key => {
            if (item[key] !== undefined) {
              return item[key];
            }
          });

          return (
            item[stateKey!] === selectedState &&
            item[districtKey!] &&
            !showAllStates
          );
        });

        if (selectedStateData) {
          handleStateClick(selectedState);
        }
      }
    }, [selectedState, dataValue]);

    const handleChartClick = (labelValue: any) => {
      setSelectedState(labelValue);
    };

    // Get all state dataValue
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

    const handleColorMapedDist = (sortedDistricts: any) => {
      const districtColorMap: any = {};
      sortedDistricts.forEach((entry: any, index: any) => {
        const a = district_data.find((key: any) => entry[key]);
        const districtName = entry[a!];
        districtColorMap[districtName] =
          colorScale.colors[index % colorScale.colors.length]; // Wrap around colors if more states than colors
      });
      const colorMapedWithDistrict = [districtColorMap];
      return colorMapedWithDistrict;
    };

    const handleColorMapedState = (convertedData: any) => {
      const stateColorMap: any = {};
      convertedData?.forEach((entry: any, index: any) => {
        const a = state_data.find(key => entry[key]);
        const stateName = entry[a!];
        stateColorMap[stateName] =
          colorScale.colors[index % colorScale.colors.length]; // Wrap around colors if more states than colors
      });
      const colorMapedWithState = [stateColorMap];
      return colorMapedWithState;
    };

    // const fixedColors = colorScheme;
    const renderAllStates = () => {
      return sortedStates.map((state: string) => {
        const districtData = convertedData?.filter((item: any) => {
          const stateKey = state_data.find(key => item[key] !== undefined);
          return item[stateKey!] === state; // Check both properties for the state
        });

        const sortedDistricts = districtData.sort((a: any, b: any) => {
          const districtKeyA = district_data.find(key => a[key] !== undefined);
          const districtKeyB = district_data.find(key => b[key] !== undefined);

          return (a[districtKeyA!] || '').localeCompare(
            b[districtKeyB!] || '',
            'en',
            { sensitivity: 'base' },
          );
        });

        const colorMapedWithDistrict = handleColorMapedDist(sortedDistricts);

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
            backgroundColor: sortedDistricts.map((item: any) => {
              let b;
              colorMapedWithDistrict?.map((item1: any) => {
                const disKey = district_data.find(
                  key => item[key] !== undefined,
                );
                Object.keys(item1).forEach(key => {
                  if (item[disKey!] === key) {
                    b = item1[key];
                  }
                });
              });
              return b;
            }),
            borderColor: 'white',
            borderWidth: 1,
            barThickness: handleBarWidth(sortedDistricts),
          })),
        };

        return (
          <>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  marginLeft: '3rem',
                }}
              >
                {state}
              </text>
              {finalYear === true ? (
                <text style={{ fontSize: 14, fontWeight: 'bold' }}>
                  :
                  {uniqueYears?.map((year, index) => (
                    <span
                      key={index}
                      style={{
                        marginLeft: '10px',
                      }}
                    >
                      {year}
                    </span>
                  ))}
                </text>
              ) : null}
            </div>

            <Bar
              width={width}
              height={height}
              data={districtChartData}
              plugins={show_values ? [ChartDataLabels] : []}
              options={handleChartOptions(sortedDistricts)}
            />
            <div
              style={{
                border: '1px solid #a8b7b7',
                marginBottom: '10px',
                width: '95%',
              }}
            ></div>
          </>
        );
      });
    };

    const colorMapedWithDistrict = handleColorMapedDist(selectedDistrictData);

    const dynamicDatasetsForBar = dynamicKeys.map((key, index) => ({
      label: key,
      data: selectedDistrictData.map((item: any) => {
        const a = Object.keys(item);
        let b;
        a?.map(item1 => {
          if (item1 === key) {
            b = item[key];
          }
        });
        return b;
      }),
      backgroundColor: selectedDistrictData.map((item: any) => {
        let b;
        colorMapedWithDistrict?.map((item1: any) => {
          const disKey = district_data.find(key => item[key] !== undefined);
          Object.keys(item1).forEach(key => {
            if (item[disKey!] === key) {
              b = item1[key];
            }
          });
        });
        return b;
      }),
      borderColor: 'white',
      borderWidth: 1,
      barThickness: handleBarWidth(selectedDistrictData),
    }));

    dataValue?.sort((a: any, b: any) => {
      const stateKey = state_data.find(key => a[key] !== undefined);
      return a[stateKey!] > b[stateKey!] ? 1 : -1;
    });

    const colorMapedWithStates = handleColorMapedState(convertedData);

    const dynamicDatasetsForBar1 = dynamicKeys.map((key, index) => ({
      label: key,
      data: convertedData?.map((item: any) => {
        const a = Object.keys(item);
        let b;
        a?.map(item1 => {
          if (item1 === key) {
            b = item[key];
          }
        });
        return b;
      }),
      borderWidth: 1,
      backgroundColor: convertedData?.map((item: any) => {
        let b;
        colorMapedWithStates?.map(item1 => {
          const stateKey = state_data.find(key => item[key] !== undefined);
          Object.keys(item1).forEach(key => {
            if (item[stateKey!] === key) {
              b = item1[key];
            }
          });
        });
        return b;
      }),
      borderColor: 'white',
      barThickness: handleBarWidth(convertedData),
    }));

    const getDataValue = (data: any) => {
      const values = dynamicKeys.map((key, index) => {
        return data?.map((item: any) => {
          const a = Object.keys(item);
          let b;
          a?.map(item1 => {
            if (item1 === key) {
              b = item[key];
            }
          });
          return b;
        });
      });
      return values;
    };

    const scalesValues = (data: any) => {
      const a = getDataValue(data);
      const maxSalValue = getMaxScaleValue(a, dataLabelsVerticalAlign);

      let scale: any = {};
      if (indexAxis === 'x') {
        return (scale = {
          y: {
            max: maxSalValue,
            stacked: false, // Set stacked to false for clustering
            afterFit: function (scaleInstance: any) {
              scaleInstance.width = size.xLarge * 2;
            },
            grid: {
              display: false,
            },
            beginAtZero: true,
            ticks: {
              callback: function (value: any) {
                const text = numberFormatter(value);
                return text;
              },
              display: true,
              font: {
                size: 12,
              },
            },
          },
          x: {
            stacked: false, // Set stacked to false for clustering
            beginAtZero: true,
            ticks: {
              maxRotation: 30,
              minRotation: 30,
              display: true,
              font: {
                size: 12,
              },
            },
          },
        });
      }
      if (indexAxis === 'y') {
        return (scale = {
          y: {
            stacked: false, // Set stacked to false for clustering
            afterFit: function (scaleInstance: any) {
              scaleInstance.width = 100;
            },
            grid: {
              display: false,
            },
            beginAtZero: true,
            ticks: {
              display: true,
              font: {
                size: 9,
                weight: 'bold',
              },
            },
          },
          x: {
            stacked: false, // Set stacked to false for clustering
            beginAtZero: true,
            ticks: {
              callback: function (value: any) {
                const text = numberFormatter(value);
                return text;
              },
              display: true,
              font: {
                size: 10,
              },
            },
          },
        });
      }
      return scale;
    };
    const handleChartOptions = (data: any) => {
      return {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: indexAxis,
        interaction: {
          mode: 'index' as const,
          intersect: indexAxis === 'y' ? true : false,
        },
        layout: {
          padding: {
            top: 25,
            right: 70,
            bottom: 20,
          },
        },
        scales: scalesValues(data),
        plugins: {
          // plugin added for showing the vlaues on the top of the bars with units
          datalabels: {
            anchor: 'end' as const,
            rotation: dataLabelsVerticalAlign && indexAxis === 'x' ? -90 : 0,
            align:
              dataLabelsVerticalAlign && indexAxis === 'x'
                ? -90
                : ('end' as const),
            font: {
              size: 12,
            },
            formatter: (value: any) => {
              const text = numberFormatter(value);
              return text;
            },
          },
          legend: {
            display: false,
          },
          // for the tooltip click added plugin
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
                  return tooltipItem.dataset.label + ': ' + text;
                } else {
                  const text = tooltipItem.raw;
                  return tooltipItem.dataset.label + ': ' + text;
                }
              },
            },
          },
        },
        // onClick: handleChartClick,
        onClick: (e: any, activeEls: any) => {
          let dataIndex = activeEls[0].index;
          // let datasetIndex = activeEls[0].datasetIndex;
          // let datasetLabel = e.chart.data.datasets[datasetIndex].label;
          // let value = e.chart.data.datasets[datasetIndex].data[dataIndex];
          let label = e.chart.data.labels[dataIndex];

          if (colsValues.length > 1 && !selectedState && !showAllStates) {
            handleChartClick(label);
          }
        },
      };
    };
    let headerText = props.headerText;
    if (selectedDistrictData.length > 0) {
      headerText = singleStateSelectedOnclick;
    }
    if (selectedState || isStateSelected) {
      headerText = selectedState;
    }
    if (showAllStates && !isStateSelected) {
      headerText = null;
    }
    const [scrollEnable, setScrollEnable] = useState<any>('none');

    useEffect(() => {
      if (headerText === props.headerText) {
        setScrollEnable('none');
      } else {
        setScrollEnable('auto');
      }
    }, [headerText, scrollEnable, show_values]);

    const handleDataChange = (childData: any) => {
      setDataValue(childData); // Value comming from it's child
    };
    const getSelectedMatricValue = (childData: any) => {
      setSelectedMetric(childData);
    };

    return (
      <Styles
        ref={containerRef}
        boldText={props.boldText}
        headerFontSize={props.headerFontSize}
        height={height}
        width={width}
        className="hie_main_container"
      >
        <div className="hir__head hir_container">
          <div className="hir_header_container">
            <text className="hir_header_text">{props.headerText}</text>
            <div className="hir_header_right_icons_container">
              <button
                type="button"
                className="hir_header_alignment_btn"
                onClick={handleAxisToggle}
              >
                {axisLabel === 'Vertical' ? (
                  <img
                    height="26px"
                    width="36px"
                    src={verticalBarIcon}
                    alt="down"
                  />
                ) : (
                  <img
                    height="26px"
                    width="36px"
                    src={horizontalBarIcon}
                    alt="down"
                  />
                )}
              </button>
              {showAllStates ? (
                <div className="hir_header_errow_btn" onClick={handleBackClick}>
                  <img height="36px" width="36px" src={upIcon} alt="down" />
                </div>
              ) : (
                <>
                  {isStateSelected ? (
                    <div
                      className="hir_header_errow_btn"
                      onClick={handleBackClick}
                    >
                      <img
                        height="36px"
                        width="36px"
                        src={backIcon}
                        alt="down"
                      />
                    </div>
                  ) : null}
                </>
              )}
              <>
                {!isStateSelected && !showAllStates && colsValues.length > 1 ? (
                  <div
                    className="hir_header_errow_btn"
                    onClick={handleShowAllStates}
                  >
                    <img height="36px" width="36px" src={downIcon} alt="down" />
                  </div>
                ) : null}
              </>
            </div>
          </div>
        </div>
        <div
          style={{
            height: height,
            width: width - 30,
            paddingBottom: size.xLarge,
          }}
        >
          {showAllStates &&
          !isStateSelected &&
          convertedData?.length > 0 &&
          selectedMetric !== undefined &&
          convertedData?.length > 0 ? (
            <>
              <MetricsDropdown
                echartOptions={convertedData}
                formData={formData}
                showChartFilter={showChartFilter}
                onDataChange={handleDataChange}
                getSelectedMatricValue={getSelectedMatricValue}
                selectedMetricValue={selectedMetric}
              />
              <div
                style={{
                  overflowY: scrollEnable,
                  height: height,
                  width: width - size.xsmall,
                  paddingBottom: size.xLarge * 2,
                }}
              >
                {renderAllStates()}
              </div>
            </>
          ) : (
            <>
              {selectedState || isStateSelected ? (
                <>
                  {selectedDistrictData.length > 0 &&
                  selectedMetric !== undefined ? (
                    <>
                      <MetricsDropdown
                        echartOptions={selectedDistrictData}
                        formData={formData}
                        showChartFilter={showChartFilter}
                        onDataChange={handleDataChange}
                        getSelectedMatricValue={getSelectedMatricValue}
                        selectedMetricValue={selectedMetric}
                      />
                      <div className="hir_single_chart_header">
                        <text className="hir_single_chart_header_text">
                          {selectedState}
                        </text>
                        {finalYear === true ? (
                          <text className="hir_single_chart_year_text">
                            :
                            {uniqueYears?.map((year, index) => (
                              <span
                                key={index}
                                style={{
                                  marginLeft: '10px',
                                }}
                              >
                                {year}
                              </span>
                            ))}
                          </text>
                        ) : null}
                      </div>
                      <div
                        style={{
                          overflow: scrollEnable,
                          height: height - size.large,
                          width: width,
                          paddingBottom: size.large * 3,
                        }}
                      >
                        <Bar
                          width={width}
                          height={height}
                          data={{
                            labels: selectedDistrictData.map((item: any) => {
                              const districtKey = district_data.find(
                                key => item[key] !== undefined,
                              );
                              return item[districtKey!] || '';
                            }),
                            datasets: dynamicDatasetsForBar,
                          }}
                          plugins={show_values ? [ChartDataLabels] : []}
                          options={handleChartOptions(selectedDistrictData)}
                        />
                      </div>
                    </>
                  ) : null}
                </>
              ) : (
                <div
                  style={{
                    overflow: scrollEnable,
                    height: height - size.large,
                    width: width,
                    paddingBottom: size.large * 3,
                  }}
                >
                  {convertedData.length > 0 ? (
                    <MetricsDropdown
                      echartOptions={convertedData}
                      formData={formDataValue}
                      showChartFilter={showChartFilter}
                      onDataChange={handleDataChange}
                      getSelectedMatricValue={getSelectedMatricValue}
                      selectedMetricValue={selectedMetric}
                    />
                  ) : null}
                  <>
                    {finalYear === true ? (
                      <text className="hir_single_chart_header_text">
                        {uniqueYears?.map((year, index) => (
                          <span
                            key={index}
                            style={{
                              marginLeft: '10px',
                            }}
                          >
                            {year}
                          </span>
                        ))}
                      </text>
                    ) : null}
                    <Bar
                      width={width}
                      height={height}
                      data={{
                        labels: convertedData?.map((item: any) => {
                          const districtKey = state_data.find(
                            key => item[key] !== undefined,
                          );
                          return item[districtKey!] || '';
                        }),
                        datasets: dynamicDatasetsForBar1,
                      }}
                      plugins={show_values ? [ChartDataLabels] : []}
                      options={handleChartOptions(dataValue)}
                    />
                  </>
                </div>
              )}
            </>
          )}
        </div>
      </Styles>
    );
  };

export default SupersetPluginChartHelloWorld;
