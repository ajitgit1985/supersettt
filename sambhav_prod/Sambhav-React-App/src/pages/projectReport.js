import React, { useState, useEffect, useRef } from "react";
import {
  GetAllProjects,
  GetQuarters,
  GetViewDataDetails,
} from "../api/pragyanAPI";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
// import axios from "axios";
import { useParams } from "react-router-dom";
import Select from "react-select";
import Back from "../assets/images/back.svg";
import { saveAs } from "file-saver";
import Reset from "../assets/images/reset_icon.svg";
import Close from "../assets/images/close-ic.svg";
import ReactModal from "react-modal";

const ProjectReport = () => {
  const [data, setData] = useState([]);
  const { projectCode } = useParams();
  const [projectOptions, setProjectOptions] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const selectInputRef = useRef();
  const [quarterOptions, setQuarterOptions] = useState([]);
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [projectQuarterFilter, setProjectQuarterFilter] = useState({
    show: false,
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [columns, setColumns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(20);
  const [maxPageButtons] = useState(10);
  const ExcelJS = require("exceljs");
  const [filteredData, setFilteredData] = useState([]);
  const [currentRows, setCurrentRows] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [radioValue, setRadioValue] = useState("withoutLGD");

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [data]);

  useEffect(() => {
    if (projectCode) {
      fetchData(projectCode);
    }
  }, [projectCode]);

  const fetchProjects = async () => {
    try {
      const data = await GetAllProjects();
      const options = data.map((project) => ({
        value: String(project.projectCode),
        label: project.projectName,
      }));
      setProjectOptions(options);
    } catch (error) {
      console.error("Error fetching sector data:", error);
    }
  };

  const handleProjects = async (selectedOption) => {
    setSelectedProject(selectedOption);
    console.log("selectedOption", selectedOption.value);
    if (selectedOption) {
      await fetchData(selectedOption.value);
      fetchQuarters();
      setProjectQuarterFilter({ show: true });
    }
  };

  const fetchQuarters = async () => {
    try {
      const data = await GetQuarters();
      const options = data.map((quarter) => ({
        value: "Q" + quarter.quarterCode,
        label: "Q" + quarter.quarterValue,
      }));
      setQuarterOptions(options);
    } catch (error) {
      console.error("Error fetching state data:", error);
    }
  };

  const handleQuarters = (selectedOption) => {
    setSelectedQuarter(selectedOption);

    const filteredData2 = data.filter((item) =>
      item.quarter_year.startsWith(selectedOption.value)
    );

    setFilteredData(filteredData2);
    setCurrentPage(1);
  };

  const fetchData = async (projectCode) => {
    try {
      const response = await GetViewDataDetails(projectCode);
      const fetchedData = response;

      if (fetchedData.length > 0) {
        const cols = Object.keys(fetchedData[0]).filter(
          (col) =>
            col !== "max_date" &&
            col !== "quartor" &&
            col !== "date" &&
            col !== "finyear" &&
            col !== "scheme_name" &&
            col !== "country_code" &&
            col !== "country_name" &&
            col !== "project_code" &&
            col !== "state_code" &&
            col !== "dist_code" &&
            col !== "city_code" &&
            col !== "village_code"
        );
        setColumns(cols);
      }

      setData(fetchedData);
      setFilteredData(fetchedData);
      setCurrentRows(fetchedData);
      console.log("fetchedData", fetchedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  useEffect(() => {
    if (filteredData?.length > 0) {
      const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
      setCurrentRows(currentRows);
    } else {
      const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
      setCurrentRows(currentRows);
    }
  }, [filteredData, currentRows]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const pageNumbers = [];
  if (totalPages <= maxPageButtons) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    const halfMaxButtons = Math.floor(maxPageButtons / 2);
    let start = Math.max(1, currentPage - halfMaxButtons);
    let end = Math.min(totalPages, start + maxPageButtons - 1);

    if (end - start < maxPageButtons - 1) {
      start = Math.max(1, end - maxPageButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
  }

  const handleClear = () => {
    if (selectInputRef.current && selectInputRef.current.select) {
      selectInputRef.current.select.clearValue();
    }
    // fetchData();
    // setSelectedProject(null);
    // setSelectedQuarter(null);
    window.location.reload();
    // navigate(`/projectdataLog`);
  };

  const handleRadioChange = (e) => {
    const { value } = e.target;
    if (value === "withLGD") {
      const updatedColumns = Object.keys(data[0]).filter(
        (col) =>
          col !== "max_date" &&
          col !== "quartor" &&
          col !== "date" &&
          col !== "finyear" &&
          col !== "country_code" &&
          col !== "country_name" &&
          (col += col.includes("_code"))
      );
      setColumns(updatedColumns);
    } else {
      const defaultColumns = Object.keys(data[0]).filter(
        (col) =>
          col !== "max_date" &&
          col !== "quartor" &&
          col !== "date" &&
          col !== "finyear" &&
          col !== "scheme_name" &&
          col !== "country_code" &&
          col !== "country_name" &&
          col !== "project_code" &&
          col !== "state_code" &&
          col !== "dist_code" &&
          col !== "city_code" &&
          col !== "village_code"
      );
      setColumns(defaultColumns);
    }
  };

  const resetModalState = () => {
    setIsOpen(false);
    setRadioValue("withoutLGD"); // Reset radio value
    const defaultColumns = Object.keys(data[0]).filter(
      (col) =>
        col !== "max_date" &&
        col !== "quartor" &&
        col !== "date" &&
        col !== "finyear" &&
        col !== "scheme_name" &&
        col !== "country_code" &&
        col !== "country_name" &&
        col !== "project_code" &&
        col !== "state_code" &&
        col !== "dist_code" &&
        col !== "city_code" &&
        col !== "village_code"
    );
    setColumns(defaultColumns); // Reset columns
    setCurrentRows(filteredData);
  };

  const exportToCsv = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    worksheet.properties.defaultRowHeight = 20;
    const headerRow = worksheet.getRow(1);
    headerRow.height = 37;

    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "darkVertical",
      fgColor: { argb: "e6ecff" },
    };

    worksheet.getRow(1).font = {
      size: 14,
      bold: true,
      lineHeight: 1,
    };

    worksheet.getRow(1).alignment = {
      vertical: "middle",
      wrapText: true,
    };

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.alignment = { wrapText: true };
      });
    });

    const columnWidthMapping = {
      project_name: 30,
      state_name: 20,
      state_code: 10,
      district_name: 20,
      dist_code: 10,
      city_name: 25,
      city_code: 10,
      village_name: 30,
      village_code: 10,
      quarter_year: 20,
    };

    const exportColumns = columns.map((col) => ({
      header: getDisplayName[col] || col,
      key: col,
      width: columnWidthMapping[col] || 40,
    }));

    worksheet.columns = [
      { header: "Sr. No.", key: "sn", width: 10 },
      ...exportColumns,
    ];
    // console.log("row>>>>>", filteredData, exportColumns);

    const rows = filteredData.map((item, index) => {
      const row = { sn: index + 1 };
      exportColumns.forEach((col) => {
        row[col.key] = item[col.key];
      });
      return row;
    });

    // console.log("row", rows);
    worksheet.addRows(rows);

    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        if (rowNumber % 2 === 0) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "e1e1e1" },
          };
        }
      });
    });

    worksheet.eachRow((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "c8c8c8" } },
        left: { style: "thin", color: { argb: "c8c8c8" } },
        bottom: { style: "thin", color: { argb: "c8c8c8" } },
        right: { style: "thin", color: { argb: "c8c8c8" } },
      };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "export.xlsx");
  };

  const getDisplayName = {
    project_code: "Project Code",
    project_name: "Project Name",
    state_name: "State Name",
    city_name: "City Name",
    state_code: "State Code",
    district_name: "District Name",
    dist_code: "District Code",
    city_code: "City Code",
    village_name: "Village Name",
    village_code: "Village Code",
    quarter_year: "Quarter Year",
  };

  return (
    <div>
      <Header />
      <section className="BI__product__container">
        <div className="dropdown__header CKR_pad">
          <div className="container-fluid mb-2">
            <div className="flex row py-2">
              <div className="d-flex align-items-center justify-start col-md-9 px-1">
                <div className="row w-100">
                  <div className="btnbox px-1">
                    <a href="/dashboard" className="NEbtn back_btn px-2">
                      <img src={Back} alt="reset icon" /> Back
                    </a>
                  </div>
                  <div
                    className="px-1 select-container"
                    style={{ width: "500px" }}
                  >
                    <Select
                      value={selectedProject}
                      placeholder="Select Scheme"
                      options={projectOptions}
                      onChange={handleProjects}
                    />
                  </div>
                  {projectQuarterFilter.show && (
                    <div
                      className="px-1 select-container"
                      style={{ width: "170px" }}
                    >
                      <Select
                        options={quarterOptions}
                        onChange={handleQuarters}
                        value={selectedQuarter}
                        placeholder="Select Quarter"
                      />
                    </div>
                  )}
                  <div className="box_reset px-1">
                    <button
                      className="NEbtn reset_btn px-2"
                      onClick={() => handleClear("")}
                      title="Reset Filter"
                    >
                      <img src={Reset} alt="reset icon" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="d-flex col-md-3 justify-content-end">
                <div className="d-flex px-3">
                  <button
                    onClick={() => setIsOpen(true)}
                    className="NEbtn export_btn"
                    disabled={buttonDisabled}
                  >
                    Export Data
                  </button>
                  <ReactModal
                    className="reportModal"
                    isOpen={isOpen}
                    onRequestClose={resetModalState}
                    contentLabel="Example Modal"
                    style={{
                      content: {
                        backgroundColor: "white",
                        width: "470px",
                        height: "235px",
                        border: "1px solid #ccc",
                        padding: "20px",
                      },
                      overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                      },
                    }}
                  >
                    <div className="modalContent">
                      <button
                        onClick={resetModalState}
                        className="NEbtn close_btn"
                      >
                        <img
                          src={Close}
                          alt="Close icon"
                          style={{ height: "15px" }}
                        />
                      </button>
                      <div>
                        <div>
                          <h5
                            style={{
                              borderBottom: "1px solid #ccc",
                              paddingBottom: "5px",
                            }}
                          >
                            Export data
                          </h5>
                        </div>
                        <div style={{ paddingLeft: "10px" }}>
                          <div className="form-check">
                            <label>
                              <input
                                className="form-check-input"
                                type="radio"
                                name="addColumns"
                                value="withLGD"
                                onChange={handleRadioChange}
                              />
                              With LGD Codes
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="addColumns"
                              value="withoutLGD"
                              defaultChecked
                              onChange={handleRadioChange}
                            />
                            <label className="form-check-label">
                              Without LGD Codes
                            </label>
                          </div>
                        </div>
                        <div className="mdNBtnBox">
                          <button
                            className="NEbtn submit_btn"
                            onClick={exportToCsv}
                          >
                            Export
                          </button>
                        </div>
                      </div>
                    </div>
                  </ReactModal>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dept_color1 dept_container">
          <div className="container-fluid">
            <div className="row">
              {filteredData?.length > 0 || data.length > 0 ? (
                <div>
                  <div className="table-responsive">
                    <table className="NETable project_data_table table table-bordered table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Sr. No.</th>
                          {columns.map((col, index) => (
                            <th key={index}>{getDisplayName[col] || col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="table-group-divider">
                        {currentRows.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            {columns.map((col, colIndex) => (
                              <td key={colIndex}>{item[col]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <nav>
                    <ul className="pagination">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => paginate(currentPage - 1)}
                        >
                          Previous
                        </button>
                      </li>
                      {pageNumbers.map((number) => (
                        <li
                          key={number}
                          className={`page-item ${
                            currentPage === number ? "active" : ""
                          }`}
                        >
                          <button
                            onClick={() => paginate(number)}
                            className="page-link"
                          >
                            {number}
                          </button>
                        </li>
                      ))}
                      <li
                        className={`page-item ${
                          currentPage === totalPages ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => paginate(currentPage + 1)}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              ) : (
                <div className="blinkMe blMsg">
                  <p>"Please select Scheme"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer className="overview_pad prayas__ml_250" />
    </div>
  );
};

export default ProjectReport;
