import React from 'react';

const Database = props => {
  return (
    <>
      <ul>
        <li>
          <div
            className="my-1"
            variant="outlined"
            color="primary"
            onClick={props.actionProvider.MySQL}
            style={{
              cursor: 'pointer',
              marginBottom: 5,
              border: 'solid 1px #2898ec',
              borderRadius: 6,
              padding: '5px 10px',
            }}
          >
            <span style={{ fontSize: 12, color: '#3853c6' }}>MySQL</span>
          </div>
        </li>
        <li>
          <div
            className="my-1"
            variant="outlined"
            color="primary"
            onClick={props.actionProvider.PostgreSQL}
            style={{
              cursor: 'pointer',
              marginBottom: 5,
              border: 'solid 1px #2898ec',
              borderRadius: 6,
              padding: '5px 10px',
            }}
          >
            <span style={{ fontSize: 12, color: '#3853c6' }}>PostgreSQL</span>
          </div>
        </li>
        <li>
          <div
            className="my-1"
            variant="outlined"
            color="primary"
            onClick={props.actionProvider.SQLite}
            style={{
              cursor: 'pointer',
              marginBottom: 5,
              border: 'solid 1px #2898ec',
              borderRadius: 6,
              padding: '5px 10px',
            }}
          >
            <span style={{ fontSize: 12, color: '#3853c6' }}>SQLite</span>
          </div>
        </li>
        <li>
          <div
            className="my-1"
            variant="outlined"
            color="primary"
            onClick={props.actionProvider.Presto}
            style={{
              cursor: 'pointer',
              marginBottom: 5,
              border: 'solid 1px #2898ec',
              borderRadius: 6,
              padding: '5px 10px',
            }}
          >
            <span style={{ fontSize: 12, color: '#3853c6' }}>Presto</span>
          </div>
        </li>
      </ul>
    </>
  );
};
export default Database;
