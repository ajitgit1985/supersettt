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
import React from 'react';
import cx from 'classnames';
import { TableInstance } from 'react-table';
import { styled } from '@superset-ui/core';
import Icons from 'src/components/Icons';
import { Item } from '../Pagination/Item';

interface TableCollectionProps {
  getTableProps: (userProps?: any) => any;
  getTableBodyProps: (userProps?: any) => any;
  prepareRow: TableInstance['prepareRow'];
  headerGroups: TableInstance['headerGroups'];
  rows: TableInstance['rows'];
  columns: TableInstance['column'][];
  loading: boolean;
  highlightRowId?: number;
  columnsForWrapText?: string[];
  data?: any;
  apiId?: any;
  handleId?: any;
}

export const Table = styled.table`
  ${({ theme }) => `
    background-color: ${theme.colors.grayscale.light5};
    border-collapse: separate;
    border-radius: ${theme.borderRadius}px;

    thead > tr > th {
      border: 0;
    }

    tbody {
      tr:first-of-type > td {
        border-top: 0;
      }
    }
    th {
      background: ${theme.colors.grayscale.light5};
      position: sticky;
      top: 0;

      &:first-of-type {
        padding-left: ${theme.gridUnit * 4}px;
      }

      &.xs {
        min-width: 25px;
      }
      &.sm {
        min-width: 50px;
      }
      &.md {
        min-width: 75px;
      }
      &.lg {
        min-width: 100px;
      }
      &.xl {
        min-width: 150px;
      }
      &.xxl {
        min-width: 200px;
      }

      span {
        white-space: nowrap;
        display: flex;
        align-items: center;
        line-height: 2;
      }

      svg {
        display: inline-block;
        position: relative;
      }
    }

    td {
      &.xs {
        width: 25px;
      }
      &.sm {
        width: 50px;
      }
      &.md {
        width: 75px;
      }
      &.lg {
        width: 100px;
      }
      &.xl {
        width: 150px;
      }
      &.xxl {
        width: 200px;
      }
    }

    .table-cell-loader {
      position: relative;

      .loading-bar {
        background-color: ${theme.colors.secondary.light4};
        border-radius: 7px;

        span {
          visibility: hidden;
        }
      }

      .empty-loading-bar {
        display: inline-block;
        width: 100%;
        height: 1.2em;
      }
    }

    .actions {
      white-space: nowrap;
      min-width: 100px;

      svg,
      i {
        margin-right: 8px;

        &:hover {
          path {
            fill: ${theme.colors.primary.base};
          }
        }
      }
    }

    .table-row {
      .actions {
        opacity: 0;
        font-size: ${theme.typography.sizes.xl}px;
        display: flex;
      }

      &:hover {
        background-color: ${theme.colors.secondary.light5};

        .actions {
          opacity: 1;
          transition: opacity ease-in ${theme.transitionTiming}s;
        }
      }
    }

    .table-row-selected {
      background-color: ${theme.colors.secondary.light4};

      &:hover {
        background-color: ${theme.colors.secondary.light4};
      }
    }

    .table-cell {
      font-feature-settings: 'tnum' 1;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 320px;
      line-height: 1;
      vertical-align: middle;
      &:first-of-type {
        padding-left: ${theme.gridUnit * 4}px;
      }
      &__wrap {
        white-space: normal;
      }
      &__nowrap {
        white-space: nowrap;
      }
    }

    @keyframes loading-shimmer {
      40% {
        background-position: 100% 0;
      }

      100% {
        background-position: 100% 0;
      }
    }
  `}
`;

Table.displayName = 'table';

export default React.memo(
  ({
    getTableProps,
    getTableBodyProps,
    prepareRow,
    headerGroups,
    columns,
    rows,
    loading,
    highlightRowId,
    columnsForWrapText,
    data,
    handleId,
    apiId,
  }: TableCollectionProps) => (
    <Table
      {...getTableProps()}
      className="table table-hover"
      data-test="listview-table"
    >
      <thead>
        {headerGroups.map(headerGroup => {
          let b = false;
          if (data !== undefined) {
            const a = data[0]?.url?.includes('/superset/dashboard');
            b = a;
          }
          return (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {b ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: 13,
                  }}
                >
                  <text
                    style={{
                      color: '#333333',
                      fontSize: 14,
                      fontWeight: 'bold',
                    }}
                  >
                    Indicator
                  </text>
                </div>
              ) : null}
              {headerGroup.headers.map(column => {
                let sortIcon = <Icons.Sort />;
                if (column.isSorted && column.isSortedDesc) {
                  sortIcon = <Icons.SortDesc />;
                } else if (column.isSorted && !column.isSortedDesc) {
                  sortIcon = <Icons.SortAsc />;
                }
                // Function to store rows data in localStorage
                // const storeRowsData = () => {
                // localStorage.clear();
                // const rowsData = rows.map(row => row.original);
                // const rowsDataJson = JSON.stringify(rowsData);

                // const toolTipData = useSetAtom(tooltiData);
                // toolTipData(rowsDataJson);

                // localStorage.setItem('tooltip_data', rowsDataJson);

                // console.log('rowsDataJson', rowsDataJson);

                // const a = useAtomValue(tooltiData);
                // console.log('values1: ', a);

                // const value123 = useAtomValue(tooltiData);

                // console.log('element props ', value123);

                // };

                // storeRowsData();

                return column.hidden ? null : (
                  <>
                    {/* Existing column */}

                    <th
                      {...column.getHeaderProps(
                        column.canSort ? column.getSortByToggleProps() : {},
                      )}
                      data-test="sort-header"
                      className={cx({
                        [column.size || '']: column.size,
                      })}
                    >
                      <span>
                        {column.render('Header')}
                        {column.canSort && sortIcon}
                      </span>
                    </th>
                    {/* Add your new column here */}
                    {/* <th>New Column</th> */}
                  </>
                );
              })}
            </tr>
          );
        })}
      </thead>
      <tbody {...getTableBodyProps()}>
        {loading &&
          rows.length === 0 &&
          [...new Array(12)].map((_, i) => (
            <tr key={i}>
              {columns.map((column, i2) => {
                if (column.hidden) return null;
                return (
                  <>
                    <td
                      key={i2}
                      className={cx('table-cell', {
                        'table-cell-loader': loading,
                      })}
                    >
                      <span
                        className="loading-bar empty-loading-bar"
                        role="progressbar"
                        aria-label="loading"
                      />
                    </td>
                  </>
                );
              })}
            </tr>
          ))}
        {rows.length > 0 &&
          rows.map((row, i) => {
            prepareRow(row);
            // @ts-ignore
            const rowId = row?.original?.id;
            let b = false;
            if (data !== undefined) {
              const a = data[0]?.url?.includes('/superset/dashboard');
              b = a;
            }

            let uniqueArray = [...new Set(apiId)];

            const xyz = uniqueArray.filter(item => item === rowId);

            return (
              <tr
                data-test="table-row"
                {...row.getRowProps()}
                className={cx('table-row', {
                  'table-row-selected':
                    row.isSelected ||
                    (typeof rowId !== 'undefined' && rowId === highlightRowId),
                })}
                key={i}
              >
                {b ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      padding: '8px 0',
                    }}
                  >
                    <div
                      className="pointer"
                      style={{
                        width: '40px',
                        backgroundColor:
                          xyz[0] === rowId ? '#008000b0' : '#ffa900ed',
                        padding: '2px 0',
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        borderRadius: '4px',
                      }}
                    >
                      <text
                        style={{
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '11px',
                          lineHeight: '15px',
                        }}
                      >
                        {xyz[0] === rowId ? 'API' : 'CSV'}
                      </text>
                    </div>
                  </div>
                ) : null}
                {row?.cells?.map((cell, i) => {
                  if (cell.column.hidden) return null;
                  const columnCellProps = cell.column.cellProps || {};
                  const isWrapText = columnsForWrapText?.includes(
                    cell.column.Header as string,
                  );

                  if (cell.column.Header === 'Title') {
                    const x = cell.value;
                    const a = cell.value.toLowerCase();
                    const b = a.includes('api');
                    const c = x.replace('api', '');
                    if (b) {
                      data.map((item: any) => {
                        if (item.id === rowId) {
                          item.dashboard_title = c;
                          handleId(item.id);
                        }
                      });
                    }
                  }

                  return (
                    <td
                      data-test="table-row-cell"
                      className={cx(
                        `table-cell table-cell__${
                          isWrapText ? 'wrap' : 'nowrap'
                        }`,
                        {
                          'table-cell-loader': loading,
                          [cell.column.size || '']: cell.column.size,
                        },
                      )}
                      {...cell.getCellProps()}
                      {...columnCellProps}
                      key={i}
                    >
                      <span
                        className={cx({ 'loading-bar': loading })}
                        role={loading ? 'progressbar' : undefined}
                      >
                        <span data-test="cell-text">{cell.render('Cell')}</span>
                      </span>
                    </td>
                  );
                })}
                {/* {row.cells.map(cell => {
                  if (cell.column.hidden) return null;
                  const columnCellProps = cell.column.cellProps || {};
                  const isWrapText = columnsForWrapText?.includes(
                    cell.column.Header as string,
                  );
                  // console.log("cell",cell)
                  return (
                    <td
                      data-test="table-row-cell"
                      className={cx(
                        `table-cell table-cell__${
                          isWrapText ? 'wrap' : 'nowrap'
                        }`,
                        {
                          'table-cell-loader': loading,
                          [cell.column.size || '']: cell.column.size,
                        },
                      )}
                      {...cell.getCellProps()}
                      {...columnCellProps}
                    >
                      <span
                        className={cx({ 'loading-bar': loading })}
                        role={loading ? 'progressbar' : undefined}
                      >
                        <span data-test="cell-text">{cell.render('Cell')}</span>
                      </span>
                    </td>
                    
                  );

                })} */}
              </tr>
            );
          })}
      </tbody>
    </Table>
  ),
);
