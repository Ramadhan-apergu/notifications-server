async function errorHandler(error, req, res, next) {
  console.log(error);

  if (error.name == 'BadRequest') {
    res.status(400).json({ message: 'Bad request!' });
  } else if (error.name == 'FailedCreateData') {
    res.status(400).json({ message: 'Failed create data!' });
  } else {
    res.status(500).json({ message: 'Internal server error!' });
  }
}

module.exports = errorHandler;
