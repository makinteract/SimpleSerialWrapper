const { listAvailablePorts, connect, disconnect, sendAndReceive } = require('./index')


const usbDB = {
  ArduinoUNO: {
    vendor: 0x2341,
    board: 0x0043
  }
};

(async () => {
  const { board, vendor } = usbDB.ArduinoUNO;
  let ls = await listAvailablePorts(board, vendor);
  console.log(ls);
  port = ls[0];
  await connect(ls[0]);
  let result = await sendAndReceive('{"cmd": "status"}')
  result = await sendAndReceive('{"cmd": "status"}')
  console.log(result);
  result = await sendAndReceive('{"cmd": "reset"}')
  console.log(result);
  setTimeout(async () => {
    result = await sendAndReceive('{"cmd": "setCmdLed", "led": "gnd", "pattern": "on"}');
    console.log(result);
    disconnect();
  }, 2000);
})();