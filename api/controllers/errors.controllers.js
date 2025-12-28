exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02" || err.code === "23502" || "23503") {
    res.status(400).send({ msg: "Bad Request - database error" });
  } else {
    next(err);
  }
};

exports.handleBadPath = (req, res, next) => {
  res.status(404).send({ msg: "Not found" });
};

exports.handleInternalServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
};
