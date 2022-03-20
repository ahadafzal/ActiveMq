const { EventEmitter } = require('events');
const stompit = require('stompit');
const activeMQ = require('./activeMQ');
const Connections = require("./connection")
const Constants = require("./constants")


class ActiveMQProducer extends EventEmitter {
/**
     *
     * @param {*} destination
     * @param {*} JMSDeliveryMode
     */
constructor(destination, JMSDeliveryMode, type, contentType) {
    super();
    activeMQ.getActiveMQClient().then(activeMQClient => {
    this.setClient(Connections.get(Constants.CONNECTION_TYPES.ACTIVEMQ));
    this.setQueueParams(destination, JMSDeliveryMode, type, contentType);
    })
    .catch(error => {
        this.ready = false;
        this.emit('errorInInitialization', error);
    })
}

setQueueParams(destination, JMSDeliveryMode, type, contentType) {
    this.destination = destination;
    this.JMSDeliveryMode = JMSDeliveryMode;
    this.type = type;
    this.contentType = contentType;
    if (Connections.get(Constants.CONNECTION_TYPES.ACTIVEMQ)) {
    this.ready = true;
    } else {
    this.ready = false;
    }
}

reconnectClient() {
    if (!this.ready) {
    activeMQ.connectActiveMQ()
        .then(activeMQClient => {
        this.setClient(Connections.get(Constants.CONNECTION_TYPES.ACTIVEMQ));
        console.info(` | connection established`);
        })
        .catch(error => {
        console.error(` | error occured in connection | ${JSON.stringify(error)}`);
        return;
        });
    }
}

getClient() {
    return Connections.get(Constants.CONNECTION_TYPES.ACTIVEMQ);
}

setClient(activeMQClient) {
    // this.client = activeMQClient;
    this.ready = true;
}

/**
     *
     * @param {*} data
     */
_sendMessage (data) {
    return new Promise((resolve, reject) => {
    try{
        
        const sendParams = {
        'destination'			: this.destination,
        'content-type'		: this.contentType,
        'JMSDeliveryMode'	: this.JMSDeliveryMode,
        '_type'						: this.type
        };
        let frame = Connections.get(Constants.CONNECTION_TYPES.ACTIVEMQ).send(sendParams);
        frame.write(data);
        frame.end();
        console.info(` | message send`);
        resolve("success");
    }catch(error) {
        console.error(` | error while sending message | ${JSON.stringify(error)}`);
        reject(error);
    }
    });
}

/**
     *
     */
disconnectClient() {
    try {
        Connections.get(Constants.CONNECTION_TYPES.ACTIVEMQ).disconnect((error, response) => {
        console.info(` | disconnectClient response | error | ${JSON.stringify(error)} | response | ${JSON.stringify(response)}`)
    });
    }catch(error) {
        console.error(` | disconnectClient | error while destroying the client :: [${JSON.stringify(error)}]`);
    }
}

/**
     *
     * @param {*} data
     */
sendMessage(data) {
    return new Promise((resolve, reject) => {
    if (this.ready) {
        this._sendMessage(data)
        .then(() => {
            resolve(data);
        })
        .catch((error) => {
            reject(error);
        });
    } else {
        reject(new Error('Producer is not ready'));
    }
    });
}
}

module.exports = {
Producer: ActiveMQProducer,
};
