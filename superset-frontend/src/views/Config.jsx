import React from 'react';
import { createChatBotMessage } from 'react-chatbot-kit';
import Features from './widgets/Features';
import CSV1 from './widgets/CSV1';
import CSV from './widgets/CSV';
import Dashboard from './widgets/Dashboard';
import DatabaseConnectivity from './widgets/DatabaseConnectivity';
import Tools from './widgets/Tools';
import Excel from './widgets/Excel';
import Excel1 from './widgets/Excel1';
import Chart from './widgets/Chart';
import Chart1 from './widgets/Chart1';
import Database from './widgets/Database';
import MySQL from './widgets/MySQL';
import PostgreSQL from './widgets/PostgreSQL';
import SQLite from './widgets/SQLite';
import Presto from './widgets/Presto';
import DashboardandCharts from './widgets/DashboardandCharts';
import CSVandExcel from './widgets/CSVandExcel';
import CSVandCharts from './widgets/CSVandCharts';
const botName = 'Pragyan';

const config = {
  botName: botName,
  customStyles: {
    botMessageBox: {
      backgroundColor: '#2162cfc7',
    },

    chatButton: {
      backgroundColor: '#2898ec',
    },
  },
  initialMessages: [createChatBotMessage(`How may I help you?`)],
  state: {
    ToolsState: ['Features', 'Dashboard', 'CSV File', 'Excel File'],
    CSVState: ['Yes', 'No'],
    ExcelState: ['Yes', 'No'],
    ChartState: ['Yes', 'No'],
    DatabaseState: ['MySQL', 'SQLite', 'PostgreSQL', 'Presto'],
  },

  widgets: [
    {
      widgetName: 'Features',
      widgetFunc: props => <Features {...props} />,
      mapStateToProps: ['Features'],
    },
    {
      widgetName: 'Dashboard',
      widgetFunc: props => <Dashboard {...props} />,
      mapStateToProps: ['Dashboard'],
    },
    {
      widgetName: 'Chart',
      widgetFunc: props => <Chart {...props} />,
      mapStateToProps: ['Chart'],
    },
    {
      widgetName: 'DashboardandCharts',
      widgetFunc: props => <DashboardandCharts {...props} />,
      mapStateToProps: ['DashboardandCharts'],
    },
    {
      widgetName: 'Chart1',
      widgetFunc: props => <Chart1 {...props} />,
      mapStateToProps: ['Chart1'],
    },
    {
      widgetName: 'CSV',
      widgetFunc: props => <CSV {...props} />,
    },
    {
      widgetName: 'DatabaseConnectivity',
      widgetFunc: props => <DatabaseConnectivity {...props} />,
    },
    {
      widgetName: 'CSVandCharts',
      widgetFunc: props => <CSVandCharts {...props} />,
      mapStateToProps: ['CSVandCharts'],
    },
    {
      widgetName: 'CSV1',
      widgetFunc: props => <CSV1 {...props} />,
      mapStateToProps: ['CSVState'],
    },
    {
      widgetName: 'CSVandExcel',
      widgetFunc: props => <CSVandExcel {...props} />,
      mapStateToProps: ['CSVandExcel'],
    },
    {
      widgetName: 'Database',
      widgetFunc: props => <Database {...props} />,
      mapStateToProps: ['DatabaseState'],
    },
    {
      widgetName: 'MySQL',
      widgetFunc: props => <MySQL {...props} />,
      mapStateToProps: ['MySQLState'],
    },
    {
      widgetName: 'PostgreSQL',
      widgetFunc: props => <PostgreSQL {...props} />,
      mapStateToProps: ['PostgreSQLState'],
    },
    {
      widgetName: 'SQLite',
      widgetFunc: props => <SQLite {...props} />,
      mapStateToProps: ['SQLiteState'],
    },
    {
      widgetName: 'Presto',
      widgetFunc: props => <Presto {...props} />,
      mapStateToProps: ['PrestoState'],
    },
    {
      widgetName: 'Tools',
      widgetFunc: props => <Tools {...props} />,
      mapStateToProps: ['ToolsState'],
    },
    {
      widgetName: 'Excel',
      widgetFunc: props => <Excel {...props} />,
      mapStateToProps: ['Excel'],
    },
    {
      widgetName: 'Excel1',
      widgetFunc: props => <Excel1 {...props} />,
      mapStateToProps: ['ExcelState'],
    },
  ],
};

export default config;
