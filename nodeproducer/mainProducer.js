
const { Producer } = require("./Producer")
const temp = {
    SCRUTINY_AUTOMATION: {
        JMSDeliveryMode : 'PERSISTENT',
        contentType     : 'application/json',
        SCRUTINY_AUTOMATION_PRODUCER : {
        destination     : 'static-queue-1',
        type: "com.static_queue_1"
        }
      }
}

class PromotionalScrutinyL1Producer extends Producer {
  constructor () {
    const caller = temp.SCRUTINY_AUTOMATION;
    // console.log("here",temp,temp.SCRUTINY_AUTOMATION)
    super(caller.SCRUTINY_AUTOMATION_PRODUCER.destination,caller.JMSDeliveryMode,caller.SCRUTINY_AUTOMATION_PRODUCER.type, temp.contentType);
    this.loggingPrefix = 'staticqu1';
    this.intialConnectAttempts = 10;
    this.on('errorInInitialization', (error) => {
      if (this.intialConnectAttempts > 0) {
        this.intialConnectAttempts--;
        console.error(`${this.loggingPrefix} | error intializing [${JSON.stringify(error)})]`);
        setTimeout(() => {
            console.info(`${this.loggingPrefix} | Attempting reintialization`);
          this.ready = false;
          this.reconnectClient();
        }, 1000);
      } else {
        throw error;
      }
    });
  }
}

module.exports = new PromotionalScrutinyL1Producer();
