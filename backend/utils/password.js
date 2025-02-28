const PasswordValidator = require("password-validator");

const schema = new PasswordValidator();

// Add password validation rules to the schema
schema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits() // Must have digits
  .has()
  .symbols() // Must have special characters
  .has()
  .not()
  .spaces(); // Should not have spaces

module.exports = schema;
