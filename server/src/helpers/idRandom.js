export const generateRandomString = (length) => {
  const characters = "1234567890";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
};
// Change 10 to the desired length
