import React from 'react';

//defination  of Tools widget
//all the mathod define in actionprovider and all states of widget are passed in props
//you can use all fuunction and state with the help of props
const CSV1 = props => {
  return (
    <>
      <ul>
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
            <span style={{ fontSize: 12, color: '#3853c6' }}>Yes</span>
          </div>
        </li>
        <li>
          <div
            className="my-1"
            variant="outlined"
            color="primary"
            onClick={props.actionProvider.DatabaseConnectivity}
            style={{
              cursor: 'pointer',
              marginBottom: 5,
              border: 'solid 1px #2898ec',
              borderRadius: 6,
              padding: '5px 10px',
            }}
          >
            <span style={{ fontSize: 12, color: '#3853c6' }}>No</span>
          </div>
        </li>
      </ul>
    </>
  );
};
export default CSV1;
