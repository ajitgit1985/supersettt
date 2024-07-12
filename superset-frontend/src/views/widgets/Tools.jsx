import React from 'react';

const Tools = props => {
  return (
    <>
      <ul>
        <li>
          <div
            className="my-1"
            variant="outlined"
            color="primary"
            onClick={props.actionProvider.Features}
            style={{
              cursor: 'pointer',

              marginBottom: 5,
              border: 'solid 1px #2898ec',
              borderRadius: 6,
              padding: '5px 10px',
            }}
          >
            <span style={{ fontSize: 12, color: '#3853c6' }}>
              Features of Pragyan
            </span>
          </div>
        </li>
        <li>
          <div
            className="my-1"
            variant="outlined"
            color="primary"
            onClick={props.actionProvider.Dashboard}
            style={{
              cursor: 'pointer',

              marginBottom: 5,
              border: 'solid 1px #2898ec',
              borderRadius: 6,
              padding: '5px 10px',
            }}
          >
            <span style={{ fontSize: 12, color: '#3853c6' }}>
              Steps to create Dashboard
            </span>
          </div>
        </li>
        <li>
          <div
            className="my-1"
            variant="outlined"
            color="primary"
            onClick={props.actionProvider.CSV1}
            style={{
              cursor: 'pointer',

              marginBottom: 5,
              border: 'solid 1px #2898ec',
              borderRadius: 6,
              padding: '5px 10px',
            }}
          >
            <span style={{ fontSize: 12, color: '#3853c6' }}>
              Steps to upload CSV File
            </span>
          </div>
        </li>
        <li>
          <div
            className="my-1"
            variant="outlined"
            color="primary"
            onClick={props.actionProvider.Excel1}
            style={{
              cursor: 'pointer',

              marginBottom: 5,
              border: 'solid 1px #2898ec',
              borderRadius: 6,
              padding: '5px 10px',
            }}
          >
            <span style={{ fontSize: 12, color: '#3853c6' }}>
              Steps to upload Excel File
            </span>
          </div>
        </li>
        <li>
          <div
            className="my-1"
            variant="outlined"
            color="primary"
            onClick={props.actionProvider.Chart1}
            style={{
              cursor: 'pointer',
              marginBottom: 5,
              border: 'solid 1px #2898ec',
              borderRadius: 6,
              padding: '5px 10px',
            }}
          >
            <span style={{ fontSize: 12, color: '#3853c6' }}>
              Steps to Create Charts
            </span>
          </div>
        </li>
        <li>
          <div
            className="my-1"
            variant="outlined"
            color="primary"
            onClick={props.actionProvider.Database}
            style={{
              cursor: 'pointer',
              marginBottom: 5,
              border: 'solid 1px #2898ec',
              borderRadius: 6,
              padding: '5px 10px',
            }}
          >
            <span style={{ fontSize: 12, color: '#3853c6' }}>
              Steps to Connect Database
            </span>
          </div>
        </li>
      </ul>
    </>
  );
};
export default Tools;
