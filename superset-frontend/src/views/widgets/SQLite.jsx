import React from 'react';

const SQLite = () => {
  return (
    <ul>
      <li>
        <h7>Go to settings on the right of top menu </h7>
      </li>
      <li>
        <h7>Select Database Connections </h7>
      </li>
      <li>
        <h7>Click on "+DATABASE" on the right side below settings</h7>
      </li>
      <li>
        <h7>Select "SQLITE" database to connect</h7>
      </li>
      <li>
        <h7>
          SQLALCHEMY
          URI:"presto://username:password@hostname:port/database,key=value"
        </h7>
      </li>
      <li>
        <h7>
          For Example:"mysql://scott:tiger@hostname/dbname",encoding='latin1',
          echo=True
        </h7>
      </li>
      <li>
        <h7>Click Connect</h7>
      </li>
    </ul>
  );
};
export default SQLite;
