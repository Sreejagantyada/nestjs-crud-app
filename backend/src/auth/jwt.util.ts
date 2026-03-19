import * as jwt from "jsonwebtoken"; 
// Import the jsonwebtoken library which is used to create and verify JWT tokens

import * as dotenv from 'dotenv';
// Import dotenv to load environment variables from the .env file

dotenv.config();
// Loads variables from the .env file into process.env

// Check if JWT_SECRET exists in the environment variables
// This secret key is required to sign and verify JWT tokens
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env file");
}

// Store the secret key in a constant variable
// This key will be used both for signing and verifying tokens
const SECRET = process.env.JWT_SECRET;

// Function to generate a JWT token when a user logs in
export function generateToken(userId) {

  // jwt.sign() creates a new token
  return jwt.sign(

    { userId }, 
    // Payload: data that will be embedded inside the token
    // Here we are storing the user's ID

    SECRET,
    // Secret key used to cryptographically sign the token

    { expiresIn: "1h" }
    // Token expiration time
    // After 1 hour the token becomes invalid
  );
}

// Function to verify a JWT token sent by the client
export function verifyToken(token) {

  // jwt.verify() checks if:
  // 1. Token signature is valid
  // 2. Token was signed with the correct SECRET
  // 3. Token has not expired
  // If valid → returns decoded payload
  // If invalid → throws an error
  return jwt.verify(token, SECRET);
}