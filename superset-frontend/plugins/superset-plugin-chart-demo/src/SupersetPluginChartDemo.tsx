import React, { useEffect, createRef, useRef, useState } from 'react';
import { styled } from '@superset-ui/core';
import {
  SupersetPluginChartDemoProps,
  SupersetPluginChartDemoStylesProps,
} from './types';
import { useAtomValue } from 'jotai';
import { dashboardFilterSelected } from 'src/views/atoms';

const Styles = styled.div<SupersetPluginChartDemoStylesProps>`
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
import downIcon from '../src/images/DipValue.gif';
import upIcon from '../src/images/GrowthValue.gif';

import Lottie from 'react-lottie';
import upAnimationData from '../src/images/up.json';
import downAnimationData from '../src/images/down.json';

export default function SupersetPluginChartDemo(
  props: SupersetPluginChartDemoProps,
) {
  const { data, height, width, numberFormatter } = props;

  //   const rootElem = createRef<HTMLDivElement>();

  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const isFilterSelectedOnDashboard = useAtomValue(dashboardFilterSelected);

  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };

    // Update container size on mount and window resize
    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', updateContainerSize);
    };
  }, [width, height]);

  const xsmall = `${
    Math.min(containerSize.width, containerSize.height) * 0.06
  }px`;
  const small = `${
    Math.min(containerSize.width, containerSize.height) * 0.09
  }px`;
  const meadium = `${
    Math.min(containerSize.width, containerSize.height) * 0.13
  }px`;
  const large = `${
    Math.min(containerSize.width, containerSize.height) * 0.2
  }px`;
  // const resolution = dimensions.width + dimensions.height;

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
  // Default two values and applying filters from dashboard with
  let dataValue;
  // console.log('sortDatavalue', newData);

  if (isFilterSelectedOnDashboard) {
    dataValue = newData;
  } else {
    dataValue = newData.slice(0, 2);
  }

  let isGreater = false;

  const data1 = dataValue; // Assuming dataValue contains your JSON data

  function findMaxValue(obj) {
    let maxValue = -Infinity;
    for (let key in obj) {
      if (typeof obj[key] === 'number' && obj[key] > maxValue) {
        maxValue = obj[key];
      }
    }
    return maxValue;
  }

  let maxValue = findMaxValue(data1[0]);

  for (let i = 1; i < data1.length; i++) {
    const obj = data1[i];
    const objMaxValue = findMaxValue(obj);
    if (objMaxValue > maxValue) {
      isGreater = true;
      // maxValue = objMaxValue; // Update maxValue
    }
  }

  console.log('Is there a greater value:', isGreater);

  // console.log('Maximum value found:', maxValue);

  // dataValue.map((item, index) => {
  //   const rev = Object.values(item).reverse();

  //   const indexfirst = rev[0];
  //   const indexsecond = rev[1];
  //   if (indexfirst > indexsecond) {
  //     isGreater = true;
  //   }

  const upAnimationData1 = {
    loop: true,
    autoplay: true,
    animationData: upAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const downAnimationData1 = {
    loop: true,
    autoplay: true,
    animationData: downAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: null, // This will be set dynamically
  //   rendererSettings: {
  //     preserveAspectRatio: 'xMidYMid slice',
  //   },
  // };

  return (
    <Styles
      // ref={containerRef}

      ref={containerRef}
      boldText={props.boldText}
      height={height}
      width={width}
    >
      <div
        style={{
          width: containerSize.width - 30,
          height: containerSize.height - 30,
          overflow: 'auto',
        }}
      >
        {dataValue.map((item, index) => {
          const rev = Object.values(item).reverse();

          const indexfirst = rev[0];
          const indexsecond = rev[1];
          if (indexfirst > indexsecond) {
            isGreater = true;
          }

          // console.log('isvalue', isGreater);

          return rev.map((value, i) => {
            return (
              <>
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  {typeof value === 'number' ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {index === 0 && (
                        <>
                          {isGreater ? (
                            <Lottie
                              options={downAnimationData1}
                              height={47}
                              width={30}
                            />
                          ) : (
                            <Lottie
                              options={upAnimationData1}
                              height={47}
                              width={30}
                            />
                          )}
                        </>
                      )}
                      <text
                        style={{
                          fontSize: index == 0 ? large : meadium,
                          marginLeft: index === 0 ? 10 : 40,
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
                        <text style={{ fontWeight: 'bold', fontSize: meadium }}>
                          N/A
                          <text style={{ fontSize: xsmall, marginLeft: 40 }}>
                            (Data Not Available)
                          </text>
                        </text>
                      ) : (
                        <text style={{ fontSize: small, marginLeft: 40 }}>
                          {value}
                        </text>
                      )}
                    </div>
                  )}
                </div>
              </>
            );
          });
        })}
      </div>
    </Styles>
  );
}
