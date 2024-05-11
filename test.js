const Users = require("./src/classes/user");

const User = new Users(
  "kabeer",
  "kabeer@freedon.io",
  "dummy",
  "Kabeer",
  "Ahmad",
  "M",
  "08/24/1999",
  "03474002745",
  "03474002745",
  "111-A Al-Kabir Town, Lahore",
  "Lahore",
  "Punjab",
  "Country",
  "AppMng",
  "01/01/1979",
  "01/01/1979"
);

console.log(User.getUserAge());
