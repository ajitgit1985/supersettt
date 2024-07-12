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

  // Default two values and applying filters from dashboard with
  let dataValue;

  if (isFilterSelectedOnDashboard) {
    dataValue = sortedData;
  } else {
    dataValue = sortedData.slice(0, 2);
  }
  console.log('sortDatavalue', sortedData);

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
          // console.log('sortdata', rev);
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
                        fontSize: index == 0 ? large : meadium,
                      }}
                    >
                      {numberFormatter(value)}
                    </text>
                  </div>
                ) : (
                  <div
                    style={{
                      paddingBottom: index == 0 && value !== null ? xsmall : 0,
                    }}
                  >
                    {value === null ? (
                      <text style={{ fontWeight: 'bold', fontSize: meadium }}>
                        N/A
                      </text>
                    ) : (
                      <text style={{ fontSize: small }}>{value}</text>
                    )}
                  </div>
                )}
              </div>
            );
          });
        })}
      </div>
    </Styles>
  );
}
