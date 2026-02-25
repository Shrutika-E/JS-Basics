const fs = require('fs');
const path = require('path');

function getBase() {
  const file = path.join(__dirname, '..', '..', 'data', 'users.json');
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = JSON.parse(raw);
  return parsed.base;
}

function generateUser() {
  const base = getBase();
  const ts = Date.now();
  const suffix = ts % 100000;
  const name = `${base.name}${suffix}`;
  const email = `${name}@${base.domain}`;
  return {
    name,
    email,
    password: base.password,
    firstName: base.firstName,
    lastName: base.lastName,
    company: base.company,
    address: base.address,
    address2: base.address2,
    country: base.country,
    state: base.state,
    city: base.city,
    zipcode: base.zipcode,
    mobile: base.mobile
  };
}

module.exports = { getBase, generateUser };
