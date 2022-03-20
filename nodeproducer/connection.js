class Connections {
    static connections = {};
    constructor() { }

    static set(key, connection){
        Connections.connections[key] = connection;
    }

    static get(key ) {
        return Connections.connections[key] ? Connections.connections[key] : false;
    }
}

module.exports =  Connections;