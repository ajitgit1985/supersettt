import React from 'react';

const CSVandExcel = () => {
  return (
    <ul>
      <b>Steps to connect CSV:</b>
      <li>
        <h7>Go to Menu</h7>
      </li>
      <li>
        <h7>Click on '+' sign on right side, beside 'Pragyan'</h7>
      </li>
      <li>
        <h7>Click Data</h7>
      </li>
      <li>
        <h7>Click on upload CSV to Database</h7>
      </li>
      <li>
        <h7>Choose CSV file from your system</h7>
      </li>
      <li>
        <h7>Give Tablename</h7>
      </li>
      <li>
        <h7>Select database you want to Connect</h7>
      </li>
      <li>
        <h7>Delimiter by default is comma no need to change</h7>
      </li>
      <li>
        <h7>Save</h7>
      </li>
      <b>Steps to connect Excel:</b>
      <li>
        <h7>Go to Menu</h7>
      </li>
      <li>
        <h7>Click on '+' sign on right side, beside 'Pragyan' on top bar</h7>
      </li>
      <li>
        <h7>Click Data</h7>
      </li>
      <li>
        <h7>Click on upload Excel file to Database</h7>
      </li>
      <li>
        <h7>Give Tablename</h7>
      </li>
      <li>
        <h7>Select Excel file you want to Upload</h7>
      </li>
      <li>
        <h7>
          Select Table Exists:<br></br> 1. If new excel file select "fail"
          <br></br> 2. If a excel file already exist with that name select
          "replace"<br></br>3. If you want to add new data into existing file
          select "Append"
        </h7>
      </li>
      <li>
        <h7>Save</h7>
      </li>
    </ul>
  );
};
export default CSVandExcel;
