const bcryptjs = require("bcryptjs");


const saltRounds = 10;

const hashPassword = async (value) => {
  const hash = await bcryptjs.hash(value, saltRounds);
  return hash;
}

const comparePassword = async (value, confirmedHash) => {
  const result = await bcryptjs.compare(value, confirmedHash);
  return result;
}

module.exports = {
  hashPassword,
  comparePassword
}