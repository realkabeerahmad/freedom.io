class Users {
  constructor(
    user_id,
    email,
    enc_password,
    firstname,
    lastname,
    gender,
    dob,
    phone,
    mobile,
    address,
    city,
    state,
    country,
    role_id,
    created_at,
    updated_at
  ) {
    this.user_id = user_id;
    this.email = email;
    this.enc_password = enc_password;
    this.firstname = firstname;
    this.lastname = lastname;
    this.gender = gender;
    this.dob = dob;
    this.phone = phone;
    this.mobile = mobile;
    this.address = address;
    this.city = city;
    this.state = state;
    this.country = country;
    this.role_id = role_id;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
  setUserId(user_id) {
    this.user_id = user_id;
  }
  setEmail(email) {
    this.email = email;
  }
  setPassword(enc_password) {
    this.enc_password = enc_password;
  }
  setFirstName(firstname) {
    this.firstname = firstname;
  }
  setLastName(lastname) {
    this.lastname = lastname;
  }
  setGender(gender) {
    this.gender = gender;
  }
  setDob(dob) {
    this.dob = dob;
  }
  setPhone(phone) {
    this.phone = phone;
  }
  setMobile(mobile) {
    this.mobile = mobile;
  }
  setAddress(address) {
    this.address = address;
  }
  setCity(city) {
    this.city = city;
  }
  setState(state) {
    this.state = state;
  }
  setCountry(country) {
    this.country = country;
  }
  setRoleId(role_id) {
    this.role_id = role_id;
  }
  setCreatedAt(created_at) {
    this.created_at = created_at;
  }
  setUpdatedAt(updated_at) {
    this.updated_at = updated_at;
  }
  getUserId() {
    return this.user_id;
  }
  getEmail() {
    return this.email;
  }
  getPassword() {
    return this.enc_password;
  }
  getFirstName() {
    return this.firstname;
  }
  getLastName() {
    return this.lastname;
  }
  getGender() {
    return this.gender;
  }
  getDob() {
    return this.dob;
  }
  getPhone() {
    return this.phone;
  }
  getMobile() {
    return this.mobile;
  }
  getAddress() {
    return this.address;
  }
  getCity() {
    return this.city;
  }
  getState() {
    return this.state;
  }
  getCountry() {
    return this.country;
  }
  getRoleId() {
    return this.role_id;
  }
  getCreatedAt() {
    return this.created_at;
  }
  getUpdatedAt() {
    return this.updated_at;
  }
  getUserAge() {
    const dob = new Date(this.getDob());
    const current = new Date();

    let age = current.getFullYear() - dob.getFullYear();
    const monthDiff = current.getMonth() - dob.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && current.getDate() < dob.getDate())
    ) {
      age--;
    }

    return age;
  }
}
module.exports = Users;
