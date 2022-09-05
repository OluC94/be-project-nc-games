exports.handleBadPath = (req, res, next) => {
    res.status(404).send({msg: "Not found"})
}

exports.handleInternalServerErrors = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({msg: 'Internal server error'});
};