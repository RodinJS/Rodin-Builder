const Emitter = require('../../utils/emitter');
const router = require('express').Router();

router.get('/', (req, res) => {
    const emitter = new Emitter(req, res);

    let buildStatus = req.project.built || false;
    return emitter.sendData(
        {
            buildStatus: buildStatus
        }
    );
});

module.exports = router;