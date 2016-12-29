const Emitter = require('../../utils/emitter');
const router = require('express').Router();

router.get('/', (req, res) => {
    const emitter = new Emitter(req, res);

    if(req.project.built) {
        return emitter.sendData(
            {
                buildStatus: true,
            }
        );
    } else {
        res.status(311).send(
            {
                error: req.project.error
            }
        )
    }
});

module.exports = router;