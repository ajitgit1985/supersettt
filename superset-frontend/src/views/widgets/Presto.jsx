import React from 'react';

const Presto = () => {
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
        <h7>Select "Presto" database to connect</h7>
      </li>
      <li>
        <h7>
          SQLALCHEMY URI:"presto://username:password@hostname:port/database"
        </h7>
      </li>
      <li>
        <h7>
          For
          Example:"presto://datascientist:securepassword@presto.example.com:8080/hive"
        </h7>
      </li>
      <li>
        <h7>Click Connect</h7>
      </li>
    </ul>
  );
};
export default Presto;
