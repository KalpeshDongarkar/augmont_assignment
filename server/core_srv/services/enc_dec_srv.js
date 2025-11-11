const bcrypt = require('bcrypt');
const crypto = require('crypto');

const ENCRYPT_KEY = 'b6b0aa1ea5ae90ec';
const ENCRYPT_IV = 'b6b0aa1ea5ae90ec';

module.exports.hashPassword = async (plainTextPassword) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
}

module.exports.compareHash = async (plnTxt, mainhash) => {
  try {
    const match = await bcrypt.compare(plnTxt, mainhash);
    return match;
  } catch (error) {
    throw new Error('Error occur while hash check');
  }
}

module.exports.encryptFn = async (data) => {
  try {
    const key = Buffer.from(ENCRYPT_KEY, 'utf8');
    const iv = Buffer.from(ENCRYPT_IV, 'utf8');
    const plaintext = JSON.stringify(data);
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  } catch (err) {
    throw new Error('Encrypt Failure');
  }
}

module.exports.decryptFn = async (encryptedData) => {
  try {
    const key = Buffer.from(ENCRYPT_KEY, 'utf8');
    const iv = Buffer.from(ENCRYPT_IV, 'utf8');
    const encryptedText = Buffer.from(encryptedData, 'base64');
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, undefined, 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  } catch (err) {
    throw new Error('Decryption Failure');
  }
}




