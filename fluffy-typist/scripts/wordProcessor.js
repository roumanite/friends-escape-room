const fs = require('fs');

fs.readFile(process.argv[2], 'utf8', function(err, data) {
  if (err) {
    throw err;
  }
  const content = "const words = " + JSON.stringify(data.split(/[\n,]/));
  fs.writeFile(process.argv[3], content, (err) => {
    if (err) {
      console.error('write file err', err);
    }
  });
});
