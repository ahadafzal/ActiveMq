
const stompit = require('stompit');

const config ={
    ActiveMQConfig: {
      reconnectOptions: {
        maxReconnects: 10,
        useExponentialBackOff: true,
        'heart-beat': '5000,5000'
      },
      serverList: [
        {
          host: "localhost",
          port: 61613,
          connectHeaders: {
            login: "admin",
            passcode: "password",
            'heart-beat': '5000,5000'
          }
        }
      ]
    }
  }


let activeMQClient;
function connectActiveMQ() {
  return new Promise((resolve, reject) => {
    const serverList = config.ActiveMQConfig.serverList;
    const reconnectOptions = config.ActiveMQConfig.reconnectOptions;
    const stompitManager = new stompit.ConnectFailover(serverList, reconnectOptions);
    stompitManager.on("error", function(error) {
        console.error(`_connectActiveMQ | Could not connect] err=[${error.message}]`);
    });

    stompitManager.on("connecting", function(connector) {
        console.info(`_connectActiveMQ | Trying to connect | transportPath=${JSON.stringify(connector)}`);
    });

    stompitManager.on("connect", function(connector) {
        console.info(`_connectActiveMQ | Connected | transportPath=[${JSON.stringify(connector)}]`);
    });
    stompitManager.connect((error, client, reconnect) => {
      if (error) {
        console.error(`ActiveMQConnector.connectActiveMQ | error occured in connection initialization | ${JSON.stringify(error)}`);
        return reject(error);
      }

      client.on('error', function (error) {
        console.error(`ActiveMQConnector.connectActiveMQ | error occured in client connection initialization | ${JSON.stringify(error)} | reconnecting`);
        reconnect();
      });
      console.info(`ActiveMQConnector.connectActiveMQ | connection established successfully`);
      activeMQClient = client;
      return resolve(activeMQClient);
    });
  });
}

const getActiveMQClient = async () => {
  try {
    if (!activeMQClient) {
      activeMQClient = await connectActiveMQ();
    }
    return activeMQClient;
  } catch (error) {
    console.error(`ActiveMQConnector.getActiveMQClient | error occured in client connection initialization | ${JSON.stringify(error)}`);
    throw error;
  }
}

module.exports = {
  connectActiveMQ,
  getActiveMQClient
}