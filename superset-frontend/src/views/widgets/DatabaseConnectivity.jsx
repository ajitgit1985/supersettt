import React from 'react';

const DatabaseConnectivity = props => {
  return (
    <ul>
      <li>
        <h7>Go to Settings on the top menu</h7>
      </li>
      <li>
        <h7>Click on Database Connectivity</h7>
      </li>
      <li>
        <h7>Click on "Edit" option of Database named "Example"</h7>
      </li>
      <li>
        <h7>Go on "Advanced" setting</h7>
      </li>
      <li>
        <h7>Go to Security</h7>
      </li>
      <li>
        <h7>Select the option "Allow file uploads to database"</h7>
      </li>
      <li>
        <h7>Click on Finish</h7>
      </li>
      <li>
        <div
          className="my-1"
          variant="outlined"
          color="primary"
          onClick={props.actionProvider.CSV}
          style={{
            cursor: 'pointer',
            marginBottom: 5,
            border: 'solid 1px #2898ec',
            borderRadius: 6,
            padding: '5px 10px',
          }}
        >
          <span style={{ fontSize: 12, color: '#3853c6' }}>Upload CSV</span>
        </div>
      </li>
      <li>
        <div
          className="my-1"
          variant="outlined"
          color="primary"
          onClick={props.actionProvider.Excel}
          style={{
            cursor: 'pointer',
            marginBottom: 5,
            border: 'solid 1px #2898ec',
            borderRadius: 6,
            padding: '5px 10px',
          }}
        >
          <span style={{ fontSize: 12, color: '#3853c6' }}>Upload Excel</span>
        </div>
      </li>
    </ul>
  );
};
export default DatabaseConnectivity;
