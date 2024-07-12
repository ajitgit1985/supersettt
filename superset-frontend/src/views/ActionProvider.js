class ActionProvider {
    constructor(createChatBotMessage, setStateFunc, createClientMessage) {
      this.createChatBotMessage = createChatBotMessage;
      this.setState = setStateFunc;
      this.createClientMessage = createClientMessage;
    }
    //method for add message in our chatbot
    addMessageToBotState = (messages) => {
      if (Array.isArray(messages)) {
        this.setState((state) => ({
          ...state,
          messages: [...state.messages, ...messages],
        }));
      } else {
        this.setState((state) => ({
          ...state,
          messages: [...state.messages, messages],
        }));
      }
    };
  
    Greeting = () => {
      const message = this.createChatBotMessage(`Hii`, {
        withAvatar: true,
      });
      this.addMessageToBotState(message);
    };
  
    Excel = () => {
      const message = this.createChatBotMessage(
        `To upload Excel file`,
        {
          withAvatar: true,
          widget: "Excel",
        }
      );
      this.addMessageToBotState(message);
    };
  
    Excel1 = () => {
      const messages = this.createChatBotMessage(
        `Have you connected to database`,
        {
          withAvatar: true,
          widget: "Excel1"
        }
      );
      this.addMessageToBotState(messages);
    };
  
    Chart = () => {
      const messages = this.createChatBotMessage(
        `Steps to create Chart`,
        {
          withAvatar: true,
          widget: "Chart"
        }
      );
      this.addMessageToBotState(messages);
    };
    Chart1 = () => {
      const messages = this.createChatBotMessage(
        `Have you connected to dataset`,
        {
          withAvatar: true,
          widget: "Chart1"
        }
      );
      this.addMessageToBotState(messages);
    };
  
    Features = () => {
      const message = this.createChatBotMessage(
        `These are the features of Pragyan`,
        {
          withAvatar: true,
          widget: "Features",
        }
      );
      this.addMessageToBotState(message);
    };
  
    Dashboard = () => {
      const messages = this.createChatBotMessage(`Steps for Dashboard:`, {
        withAvatar: true,
        widget: "Dashboard",
      });
  
      this.addMessageToBotState(messages);
    };
    DashboardandCharts = () => {
      const messages = this.createChatBotMessage(`Steps for Dashboard and Charts:`, {
        withAvatar: true,
        widget: "DashboardandCharts",
      });
  
      this.addMessageToBotState(messages);
    };
    CSV1 = () => {
      const messages = this.createChatBotMessage(
        `Have you connected to database`,
        {
          withAvatar: true,
          widget: "CSV1"
        }
      );
      this.addMessageToBotState(messages);
    };
    CSVandExcel = () => {
      const messages = this.createChatBotMessage(`Steps to connect CSV and Excel:`, {
        withAvatar: true,
        widget: "CSVandExcel",
      });
  
      this.addMessageToBotState(messages);
    };
    CSV = () => {
      const messages = this.createChatBotMessage(
        `Steps to upload CSV`,
        {
          withAvatar: true,
          widget: "CSV"
        }
      );
      this.addMessageToBotState(messages);
    };
    DatabaseConnectivity = () => {
      const messages = this.createChatBotMessage(
        `Steps for Database Connectivity`,
        {
          withAvatar: true,
          widget: "DatabaseConnectivity"
        }
      );
      this.addMessageToBotState(messages);
    };
  
    Database = () => {
      const messages = this.createChatBotMessage(
        `Steps for Database Connectivity`,
        {
          withAvatar: true,
          widget: "Database"
        }
      );
      this.addMessageToBotState(messages);
    };
    MySQL = () => {
      const messages = this.createChatBotMessage(
        `Steps for connecting MySQL`,
        {
          withAvatar: true,
          widget: "MySQL"
        }
      );
      this.addMessageToBotState(messages);
    };
    CSVandCharts = () => {
      const messages = this.createChatBotMessage(
        `Steps for connecting CSV and creating Charts are`,
        {
          withAvatar: true,
          widget: "CSVandCharts"
        }
      );
      this.addMessageToBotState(messages);
    };
    PostgreSQL = () => {
      const messages = this.createChatBotMessage(
        `Steps for connecting PostgreSQL`,
        {
          withAvatar: true,
          widget: "PostgreSQL"
        }
      );
      this.addMessageToBotState(messages);
    };
    SQLite = () => {
      const messages = this.createChatBotMessage(
        `Steps for connecting SQLite`,
        {
          withAvatar: true,
          widget: "SQLite"
        }
      );
      this.addMessageToBotState(messages);
    };
    Presto = () => {
      const messages = this.createChatBotMessage(
        `Steps for connecting Presto`,
        {
          withAvatar: true,
          widget: "Presto"
        }
      );
      this.addMessageToBotState(messages);
    };
    Exit = () => {
      const message = this.createChatBotMessage(`Bye!`, {
        withAvatar: true,
      });
      this.addMessageToBotState(message);
    };
  
    Tools = () => {
      const message = this.createChatBotMessage("These are the topics I know about", {
        withAvatar: true,
        widget: "Tools",
      });
      this.addMessageToBotState(message);
    };
  }
  
  export default ActionProvider;
  