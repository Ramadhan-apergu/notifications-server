const getDateNow = () => {
  const date = new Date();

  const options = {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  const formatter = new Intl.DateTimeFormat('en-CA', options);
  const formattedDate = formatter.format(date);

  const [datePart, timePart] = formattedDate.split(', ');
  const isoString = `${datePart}T${timePart}.000Z`;

  return isoString;
};

module.exports = getDateNow;
