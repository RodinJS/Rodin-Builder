const Emitter = require('../../utils/emitter');
const router = require('express').Router();

router.get('/', (req, res) => {
    const emitter = new Emitter(req, res);

    let buildStatus = req.project.built || false;
    let error = req.project.error || {};

    console.log('logging project', req.project);

    return emitter.sendData(
        {
            buildStatus: buildStatus,
            error: error
        }
    );
});

module.exports = router;