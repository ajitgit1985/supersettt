import React, { useEffect, createRef } from 'react';
import { styled } from '@superset-ui/core';
import {
  SupersetPluginChartDemoProps,
  SupersetPluginChartDemoStylesProps,
} from './types';

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

  const rootElem = createRef<HTMLDivElement>();

  return (
    <Styles
      ref={rootElem}
      boldText={props.boldText}
      height={height}
      width={width}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <div>
          {data.map((item, index) => {
            const rev = Object.values(item).reverse();
            return Object.values(rev).map((value, i) => {
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'row' }}>
                  {typeof value === 'number' ? (
                    <div
                      style={{ padding: index == 0 ? '40px 0' : '0 0 20px 0' }}
                    >
                      <text
                        style={{
                          height: index == 0 ? '50px' : '30px',
                          display: 'block',
                          fontSize: index == 0 ? 40 : 15,
                        }}
                      >
                        {numberFormatter(value)}
                      </text>
                    </div>
                  ) : null}
                </div>
              );
            });
          })}
        </div>
        <div>
          {data.map((item, index) => {
            const rev = Object.values(item).reverse();
            return Object.values(rev).map((value, i) => {
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'row' }}>
                  {typeof value !== 'number' ? (
                    <div
                      style={{
                        padding: index == 0 ? '40px 0' : '0 0 20px 0',
                        alignItems: 'center',
                      }}
                    >
                      <text
                        style={{
                          height: index == 0 ? '50px' : '30px',
                          display: 'block',
                        }}
                      >
                        {value}
                      </text>
                    </div>
                  ) : null}
                </div>
              );
            });
          })}
        </div>
        <div style={{ height: 1, backgroundColor: 'black' }}></div>
      </div>
      {/*
          <div key={index}>
  
            {numberFormatter(111111111111.44444)}
            
             {Object.values(item).map((value, i) => {
              return (
                <div key={i}>
                  
                  {typeof value === 'number' ? numberFormatter(value) : value}
                </div>
              );
            })}
          </div>
        */}
    </Styles>
  );
}
