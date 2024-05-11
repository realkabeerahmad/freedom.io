class SystemParameters {
  constructor(param_id, param_name, param_value, created_at, updated_at) {
    this.param_id = param_id;
    this.param_name = param_name;
    this.param_value = param_value;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
  setParamId(param_id) {
    this.param_id = param_id;
  }
  setParamName(param_name) {
    this.param_name = param_name;
  }
  setParamValue(param_value) {
    this.param_value = param_value;
  }
  setCreatedAt(created_at) {
    this.created_at = created_at;
  }
  setUpdatedAt(updated_at) {
    this.updated_at = updated_at;
  }
  getParamId() {
    return this.param_id;
  }
  getParamValue() {
    return this.param_value;
  }
  getParamName() {
    return this.param_name;
  }
  getCreatedAt() {
    return this.created_at;
  }
  getUpdatedAt() {
    return this.updated_at;
  }
}
module.exports = Users;
