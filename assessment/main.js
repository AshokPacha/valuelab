var importObject = {
  env: {
      _payload_len: () => 0,
      _payload: () => 0,
      _provide_result: () => 0,
      _send_transaction: () => 0       
  }
};

Object.assign(importObject.env, { _log: Math.log } )

const loadFile = (file) => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
      reader.onerror = () => {
          reader.abort();
          reject(new DOMException("Failed to parse contract file."))
      }
  
      reader.onload = () => {
          resolve(reader.result);
      }
  
      reader.readAsArrayBuffer(file);
  });
}

var uploadWasmfile = async (e) => {
  const file = e.target.files[0];

  try {
    const bytes = await loadFile(file);
    const contract = await WebAssembly.instantiate(bytes, importObject);
    let contractMethods = contract.instance.exports;
    
    let exportedFunctions = _.filter(Object.keys(contractMethods), exp => exp.startsWith("_contract_"));

    exportedFunctions = _.map(exportedFunctions, exp => exp.substr("_contract_".length));
    
    console.log('====================================');
    console.log(contractMethods);
    console.log('====================================');
  } catch (e) {
    console.log(e);
  }
}