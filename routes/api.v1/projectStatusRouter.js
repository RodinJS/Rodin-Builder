const Emitter = require('../../utils/emitter');
const router = require('express').Router();

router.get('/', (req, res) => {
    const emitter = new Emitter(req, res);

    if(req.project.error) {
        return emitter.sendData(
            {
                buildStatus: false,
                error: req.project.error,
                project: req.project
            }
        );
    } else {
        return emitter.sendData(
            {
                pending: !req.project.built,
                buildStatus: req.project.built,
                project: req.project
            }
        );
    }
});

module.exports = router;