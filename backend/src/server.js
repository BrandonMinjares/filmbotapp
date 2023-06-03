const app = require('./app.js');
const PORT = 3010;

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
  console.log('API Testing UI: http://localhost:3010/v0/api-docs/');
});
