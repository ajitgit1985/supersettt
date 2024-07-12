class MessageParser {
    constructor(actionProvider, state) {
      this.actionProvider = actionProvider;
      this.state = state;
    }
  
    parse = (message) => {
      const lowerCase = message.toLowerCase();
  
  
      if (
        lowerCase.includes("hi") ||
        lowerCase.includes("hii") ||
        lowerCase.includes("hiii") ||
        lowerCase.includes("hello") ||
        lowerCase.includes("hey") ||
        lowerCase.includes("hiiii") ||
        lowerCase.includes("hlo") ||
        lowerCase.includes("heyy")
      ) {
        return this.actionProvider.Greeting();
      }
      if (
        lowerCase.includes("feature") ||
        lowerCase.includes("what you provide") ||
        lowerCase.includes("what is pragyan") ||
        lowerCase.includes("provide") ||
        lowerCase.includes("services") ||
        lowerCase.includes("about")
      ) {
        return this.actionProvider.Features();
      }
      if (
        lowerCase.includes("dashboard and charts") ||
        lowerCase.includes("charts and dashboard") ||
        lowerCase.includes("how  to create dashboard and charts") ||
        lowerCase.includes("steps to create dashboard and charts") ||
        lowerCase.includes("steps to create charts and dashboard") ||
        lowerCase.includes("how to create charts and dashboards")
      ) {
        return this.actionProvider.DashboardandCharts();
      }
      if (
        lowerCase.includes("dashboard") ||
        lowerCase.includes("steps to create dashboard") ||
        lowerCase.includes("how to create dashboard")
      ) {
        return this.actionProvider.Dashboard();
      }
      if (
        lowerCase.includes("charts") ||
        lowerCase.includes("steps to create chart") ||
        lowerCase.includes("how to create chart")
      ) {
        return this.actionProvider.Chart1();
      }
      if (
        lowerCase.includes("csv and charts") ||
        lowerCase.includes("charts and csv") ||
        lowerCase.includes("steps to connect csv and create chart") ||
        lowerCase.includes("how to connect csv and create chart")
      ) {
        return this.actionProvider.CSVandCharts();
      }
      if (
        lowerCase.includes("csv and excel") ||
        lowerCase.includes("excel and csv") ||
        lowerCase.includes("steps to connect csv and excel") ||
        lowerCase.includes("how to connect csv and excel")
      ) {
        return this.actionProvider.CSVandExcel();
      }
      if (
        lowerCase.includes("upload csv") ||
        lowerCase.includes("csv file") ||
        lowerCase.includes("csv") ||
        lowerCase.includes("Connect csv")
      ) {
        return this.actionProvider.CSV1();
      }
      if (
        lowerCase.includes("excel") ||
        lowerCase.includes("connect excel to database") ||
        lowerCase.includes("excel file")
      ) {
        return this.actionProvider.Excel1();
      }
      if (
        lowerCase.includes("database") ||
        lowerCase.includes("adding database") ||
        lowerCase.includes("connecting databse") 
      ) {
        return this.actionProvider.Database();
      }
  
      if (
        lowerCase.includes("bye") ||
        lowerCase.includes("see you") ||
        lowerCase.includes("good bye") 
      ) {
        return this.actionProvider.Exit();
      }
  
  
      return this.actionProvider.Tools();
    };
  }
  
  export default MessageParser;
  