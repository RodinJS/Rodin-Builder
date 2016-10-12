const Emitter = require('../../utils/emitter');
const UniqueID = require('../../utils/UniqueID');
const CustomErrors = require('../../utils/errors');

const router = require('express').Router();

router.get('/', (req, res) => {
    const emitter = new Emitter(req, res);

    req.project.downloadUrl = `${UniqueID.v16()}${UniqueID.v16()}`;
    req.project.save(err => {
        if (err) {
            return emitter.sendError(new CustomErrors.InternalServerError());
        }

        return emitter.sendData(
            {
                downloadUrl: req.project.downloadUrl
            }
        )
    })
});

module.exports = router;