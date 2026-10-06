const http = require('http');

http.get('http://localhost:3000/api/products', (resp) => {
  let data = '';

  // A chunk of data has been received.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    console.log("Response received");
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
