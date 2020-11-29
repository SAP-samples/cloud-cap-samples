const getDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9; //  convert to nanoseconds
  const NS_TO_MS = 1e6; // convert to milliseconds
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

const getFormattedDateTime = () => {
  let currentDateTime = new Date();
  let formattedDateTime =
    currentDateTime.getFullYear() +
    "-" +
    (currentDateTime.getMonth() + 1) +
    "-" +
    currentDateTime.getDate() +
    " " +
    currentDateTime.getHours() +
    ":" +
    currentDateTime.getMinutes() +
    ":" +
    currentDateTime.getSeconds();
  return formattedDateTime;
};

module.exports = {
  getFormattedDateTime,
  getDurationInMilliseconds,
};
