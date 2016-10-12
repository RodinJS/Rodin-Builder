const Emitter = require('../../utils/emitter/index');
const CustomErrors = require('../../utils/errors');
const fs = require('fs');

const router = require('express').Router();

router.get('/', (req, res) => {
    const emitter = new Emitter(req, res);

    req.project.downloadUrl = "";
    req.project.save(err => {
        if(err) {
            return emitter.sendError(new CustomErrors.InvalidRequestData());
        }

        res.download(req.project.bin.path);
    });
});

module.exports = router;