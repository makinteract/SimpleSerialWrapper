const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline')

let serialPort;

function send(commandString) {
  serialPort?.write(`${commandString}\n\r`);
}

function sendAndReceive(command, timeout = 1000) {
  return new Promise((resolve, reject) => {

    // Parse the incoming data as text
    const parser = serialPort.pipe(new Readline());

    // Set listener
    const handleData = (data) => {
      resolve(data);
    };

    parser.on('data', handleData);

    // Timeout
    setTimeout(() => {
      parser.removeListener('data', handleData);
      reject('Timeout');
    }, timeout);

    // And finally send the data
    sendString(command);
  });
}


function listAvailablePorts(board = undefined, vendor = undefined) {
  return new Promise((resolve, reject) => {

    // Get all the ports
    SerialPort.list().then((ports) => {
      // filter by vendor
      let filteredPorts = ports.filter(({ vendorId: vid }) => {
        if (vendor) return vendor == parseInt(vid, 16);
        return true;
      });
      // filter by board
      filteredPorts = filteredPorts.filter(({ productId: pid }) => {
        if (board) return board == parseInt(pid, 16);
        return true;
      });
      // Extract the port names
      paths = filteredPorts.map(({ path }) => path)
      if (paths.length > 0) resolve(paths);
      else reject(new Error("No serial found"));
    });
  });
}


function disconnect() {
  if (!isConnected()) {
    throw new Error("Serial port not connected");
  }
  serialPort.close();
}


function isConnected() {
  return serialPort?.isOpen || false;
}

function connect(portName, baud = 115200) {
  return new Promise((resolve, reject) => {

    // Already connected?
    if (isConnected()) {
      reject("Serial port already open")
    }

    serialPort = new SerialPort(portName, {
      baudRate: baud
    }); // this might throw an error

    serialPort.on('open', () => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  });
}