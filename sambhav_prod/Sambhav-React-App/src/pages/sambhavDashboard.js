import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { DisplayDataCountInQuarterWise } from "../api/pragyanAPI";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";
import { Image } from "react-bootstrap";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import scheme from "../assets/images/scheme_ic.svg";
import KPI from "../assets/images/KPI_ic.svg";
import api from "../assets/images/api_ic.png";
import excel from "../assets/images/excel_ic.png";
import db from "../assets/images/dashboard-ic.svg";
import Reset from "../assets/images/reset_icon.svg";
import aDot from "../assets/images/action_dots.svg";

const drawLinesPlugin = {
  id: "drawLines",
  afterDraw: (chart) => {
    const ctx = chart.ctx;
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      meta.data.forEach((element, index) => {
        const dataset = chart.data.datasets[datasetIndex];
        const data = dataset.data[index];
        if (data === 0) {
          return;
        }

        const model = element.tooltipPosition();
        const startPoint = {
          x: element.x,
          y: element.y,
        };

        const endPoint = {
          x: model.x,
          y: model.y,
        };

        const chartArea = chart.chartArea;
        const midX = (chartArea.left + chartArea.right) / 2;
        const midY = (chartArea.top + chartArea.bottom) / 2;

        const angle = Math.atan2(endPoint.y - midY, endPoint.x - midX);
        const radius = element.outerRadius; // outerRadius to ensure the line starts from the outer edge
        startPoint.x = midX + radius * Math.cos(angle);
        startPoint.y = midY + radius * Math.sin(angle);

        // const reductionFactor = 1.4; // Adjust 1.4 to control the length
        const labelPos = {
          x: endPoint.x + (endPoint.x - midX) * 0.7, // Adjust 0.4 to control the length
          y: endPoint.y + (endPoint.y - midY) * 0.7, // Adjust 0.4 to control the length
        };

        // Calculate the bending point (20% of the line length)
        const bendPoint = {
          x: startPoint.x + (labelPos.x - startPoint.x) * 0.5,
          y: startPoint.y,
        };

        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(bendPoint.x, bendPoint.y);
        ctx.lineTo(labelPos.x, labelPos.y);
        ctx.strokeStyle = dataset.backgroundColor[index];
        ctx.stroke();
        ctx.closePath();
      });
    });
  },
};

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels, drawLinesPlugin);

const SambhavDashboard = () => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [currentRows, setCurrentRows] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Scheme Names",
        data: [],
        backgroundColor: [
          "#454E7C",
          "#A868B7",
          "#D3B3DA",
          "#EFA1AA",
          "#5AC189",
          "#E04355",
          "#A38F79",
          "#FEC0A1",
          "#D3B3DA",
          "#666666",
          "#FF7F44",
          "#FCC700",
          "#3CCCCB",
          "#8FD3E4",
          "#D1C6BC",
          "#FDE380",
          "#B2B2B2",
          "#CFBB70",
          "#9EE5E5",
          "#C1EBC0",
          "#C7CAFF",
          "#F09EA7",
          "#F6CA94",
          "#CDABEB",
          "#C7CAFF",
          "#FDE380",
        ],
        borderColor: [
          "#454E7C",
          "#A868B7",
          "#D3B3DA",
          "#EFA1AA",
          "#5AC189",
          "#E04355",
          "#A38F79",
          "#FEC0A1",
          "#D3B3DA",
          "#666666",
          "#FF7F44",
          "#FCC700",
          "#3CCCCB",
          "#8FD3E4",
          "#D1C6BC",
          "#FDE380",
          "#B2B2B2",
          "#CFBB70",
          "#9EE5E5",
          "#C1EBC0",
          "#C7CAFF",
          "#F09EA7",
          "#F6CA94",
          "#CDABEB",
          "#C7CAFF",
          "#FDE380",
        ],
        borderWidth: new Array(26).fill(1),
        hoverOffset: 10,
        rotation: 20,
      },
    ],
    projectCodes: [],
  });
  const [totalUniqueSchemes, setTotalUniqueSchemes] = useState(0);
  const [totalUniqueKpis, setTotalUniqueKpis] = useState(0);
  const [schemeAPICount, setSchemeAPICount] = useState(0);
  const [schemeExcelCount, setSchemeExcelCount] = useState(0);
  const [KpiAPICount, setKpiAPICount] = useState(0);
  const [KpiExcelCount, setKpiExcelCount] = useState(0);
  const [highlightIndex, setHighlightIndex] = useState(null);

  useEffect(() => {
    if (selectedScheme) {
      const filtered = currentRows.filter(
        (row) => row.schemeInShort === selectedScheme
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(currentRows);
    }
  }, [selectedScheme, currentRows]);

  const fetchData = async () => {
    try {
      const response = await DisplayDataCountInQuarterWise();
      const fetchedData = response;

      if (fetchedData.length > 0) {
        const cols = Object.keys(fetchedData[0]).filter(
          (col) =>
            col !== "projectCode" &&
            col !== "portMode" &&
            col !== "totalKpis" &&
            col !== "schemeInShort"
        );
        setColumns(cols);
      }
      const schemeNames = [
        ...new Set(
          fetchedData.map((item) => item.schemeInShort).filter(Boolean)
        ),
      ];
      const uniqueSchemeNamesSet = new Set(schemeNames);
      const uniqueSchemeNames = [...uniqueSchemeNamesSet];
      setTotalUniqueSchemes(schemeNames.length);
      setTotalUniqueKpis(fetchedData.length);

      const dataCounts = uniqueSchemeNames.map(
        (name) => schemeNames.filter((scheme) => scheme === name).length
      );
      const portModeSchemeNames = [
        ...new Set(
          fetchedData
            .filter((item) => item.portMode === 1)
            .map((item) => item.schemeName)
            .filter(Boolean)
        ),
      ];
      setSchemeAPICount(portModeSchemeNames.length);

      const schemeExcelCount = schemeNames.length - portModeSchemeNames.length;
      setSchemeExcelCount(schemeExcelCount);

      const portModeKpis = [
        ...new Set(
          fetchedData
            .filter((item) => item.portMode === 2)
            .map((item) => item.kpiName)
            .filter(Boolean)
        ),
      ];
      setKpiAPICount(portModeKpis.length);
      const KpiExcelCount = fetchedData.length - portModeKpis.length;
      setKpiExcelCount(KpiExcelCount);

      setChartData((prevState) => ({
        ...prevState,
        labels: uniqueSchemeNames,
        datasets: [
          {
            ...prevState.datasets[0],
            data: dataCounts,
            borderWidth: new Array(uniqueSchemeNames.length).fill(1), // Initialize borderWidth array
            borderColor: prevState.datasets[0].borderColor.slice(
              0,
              uniqueSchemeNames.length
            ),
          },
        ],
        projectCodes: fetchedData.map((item) => item.schemeInShort),
      }));

      setData(fetchedData);
      setFilteredData(fetchedData);
      setCurrentRows(fetchedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    if (highlightIndex !== null) {
      setChartData((prevState) => {
        const newDatasets = [...prevState.datasets];
        newDatasets[0].borderWidth = newDatasets[0].borderWidth.map((_, i) =>
          i === highlightIndex ? 3 : 1
        );
        newDatasets[0].borderColor = newDatasets[0].borderColor.map(
          (color, i) => (i === highlightIndex ? "#000000" : color)
        );
        return { ...prevState, datasets: newDatasets };
      });
    }
  }, [highlightIndex]);

  useEffect(() => {
    fetchData();
  }, []);

  const getDisplayName = {
    schemeName: "Scheme Name",
    projectCode: "Project Code",
    kpiName: "KPIs",
    portMode: "Port Mode",
    totalKpis: "Total KPIs",
  };

  const options = {
    cutout: 50,
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 85,
    },
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          usePointStyle: true,
        },
      },
      datalabels: {
        color: "black",
        font: {
          size: 13,
        },
        formatter: (value, context) => {
          return context.chart.data.labels[context.dataIndex];
        },
        anchor: "end",
        align: "end",
        offset: 20,
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const chart = elements[0].element.$context.chart;
        const index = elements[0].index;
        const projectCode = chart.data.labels[index];
        setSelectedScheme(projectCode);
        setHighlightIndex(index);
      }
    },
  };

  return (
    <div>
      <Header />
      <section className="BI__product__container">
        <div className="dept_color1 dept_container">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12 d-flex justify-content-end mb-2">
                <a
                  href="/dashboard"
                  className="NEbtn"
                  style={{ width: "250px" }}
                >
                  <Image src={db} alt="Datalog" /> &nbsp; Scheme Dashboards
                </a>
              </div>
            </div>
            <div className="flex row mb-4">
              <div className="col-md-5">
                <div className="row h-100">
                  <div className="col-md-12">
                    <div className="kpiBox color-1 mb-3 box__shadow">
                      <div className="tileContent">
                        {/* <button className="NEbtn action_btn">
                          <Image src={aDot} alt="Datalog" />
                        </button> */}
                        <div className="col">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Image
                              src={scheme}
                              alt="Scheme"
                              className="imgIcon"
                            />
                            <p>Total Schemes</p>
                          </div>
                          <h1>{totalUniqueSchemes}</h1>
                        </div>
                      </div>
                      <div className="apiContent">
                        <div>
                          <span className="boxIcon">
                            <Image
                              style={{ height: "20px" }}
                              src={api}
                              alt="Scheme"
                              className="API Icon"
                            />
                          </span>
                          API : <strong>{schemeAPICount}</strong>{" "}
                          <span>: </span>
                        </div>
                        <div>
                          <span className="boxIcon">
                            <Image
                              style={{ height: "20px" }}
                              src={excel}
                              alt="Scheme"
                              className="Excel Icon"
                            />
                          </span>
                          Excel : <strong>{schemeExcelCount}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="kpiBox color-2 box__shadow">
                      <div className="tileContent">
                        <div className="col">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Image src={KPI} alt="KPIs" className="imgIcon" />
                            <p>Total KPIs</p>
                          </div>
                          <h1>{totalUniqueKpis}</h1>
                        </div>
                      </div>
                      <div className="apiContent">
                        <div>
                          <span className="boxIcon">
                            <Image
                              style={{ height: "20px" }}
                              src={api}
                              alt="Scheme"
                              className="API Icon"
                            />
                          </span>
                          API : <strong>{KpiAPICount}</strong>
                        </div>
                        <div>
                          <span className="boxIcon">
                            <Image
                              style={{ height: "20px" }}
                              src={excel}
                              alt="Scheme"
                              className="Excel Icon"
                            />
                          </span>
                          Excel : <strong>{KpiExcelCount}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-7 pb-3">
                <div className="chart box__shadow">
                  <h5 className="mb-0 chartHeading">Schemes Onboarded</h5>
                  <Doughnut data={chartData} options={options} />
                </div>
              </div>
            </div>
            <div className="flex row">
              <div className="d-flex align-items-center justify-start col-md-12">
                <div className="dbContainer white box__shadow">
                  <div className="overviewContainer">
                    <div className="sec_about text-align-center py-2">
                      <h5 className="mb-0">Schemes Data Overview</h5>
                    </div>
                    <div className="box_reset px-1">
                      <button
                        onClick={() => setSelectedScheme(null)}
                        className="NEbtn reset_btn px-2"
                      >
                        <img src={Reset} alt="reset icon" />
                      </button>
                    </div>
                  </div>
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
                          {filteredData.map((item, index) => (
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer className="overview_pad prayas__ml_250" />
    </div>
  );
};

export default SambhavDashboard;
