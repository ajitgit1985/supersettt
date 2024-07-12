import React from 'react';

const PostgreSQL = () => {
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
        <h7>Select "PostgreSQL" database to connect</h7>
      </li>
      <li>
        <h7>
          For Host: <br></br>1.If you are working on Local host then add the IP
          of your Local host <br></br>
          2. If you are working at Server add the Ip Address of that server
        </h7>
      </li>
      <li>
        <h7>Copy the name of the database you are trying to connect.</h7>
      </li>
      <li>
        <h7>Add the Port Number of your Database</h7>
      </li>
      <li>
        <h7>
          Add the Username and Password you selected at the creation of database
        </h7>
      </li>
      <li>
        <h7>Click Connect</h7>
      </li>
    </ul>
  );
};
export default PostgreSQL;
