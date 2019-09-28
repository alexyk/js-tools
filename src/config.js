const LOG_TYPE = {
  CHROME: "chrome",
  VSCODE: "vscode"
}

let config = {
  noColor: false,
  noObjects: false,
  logType: LOG_TYPE.VSCODE
}


function setConfig(option, value) {
  if (option == "logType") {
    switch (value) {
      case LOG_TYPE.VSCODE:        
        config.noColor = true;
        config.noObjects = true;
        break;
      
      case LOG_TYPE.CHROME:        
        config.noColor = false;
        config.noObjects = false;
        break;
      
      default:
        config[option] = value;
        break;
    }
  }
  
  config[option] = value;
}

export default config;
export {
  LOG_TYPE, setConfig
}