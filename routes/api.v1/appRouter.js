const Emitter = require('../../utils/emitter');
const CustomErrors = require('../../utils/errors');
const router = require('express').Router();

/**
 * @api {get} /api/v1/app Request App Info
 * @apiName App Info
 * @apiGroup App
 *
 * @apiHeader (Authentication) {String} app-key App Key.
 * @apiHeader (Authentication) {String} app-secret App Secret.
 *
 * @apiSuccess {String} data.name App name
 * @apiSuccess {String} data.responseURL URL where will send apk files after build
 *
 * @apiSuccessExample {json} Success-Response
 *     200 OK
 *     {
 *          "success": true
 *          "data": {
 *              "name": "rodin",
 *              "responseURL": "http:<your-response-url>
 *          }
 *      }
 *
 * @apiError InvalidAppIdOrSecret
 * @apiErrorExample {json} Unauthorised:
 *      401 Unauthorised
 *      {
 *          "success": false
 *          "error": {
 *              "message": "Invalid appId or appSecret"
 *              "status": 401
 *              "timestamp": 1473756023136
 *              "type": "Authorisation Error"
 *          }
 *      }
 */
router.get('/', (req, res) => {
    const emitter = new Emitter(req, res);
    return emitter.sendData(req.app.outcome());
});

/**
 * @api {put} /api/v1/app Request App Editing
 * @apiName App Edit
 * @apiGroup App
 *
 * @apiHeader (Authentication) {String} app-key App Key.
 * @apiHeader (Authentication) {String} app-secret App Secret.
 *
 * @apiSuccess {String} data.name "update success"
 *
 * @apiSuccessExample {json} Success-Response
 *     200 OK
 *     {
 *          "success": true
 *          "data": "update success"
 *      }
 *
 * @apiError InvalidAppIdOrSecret
 * @apiErrorExample {json} Unauthorised:
 *      401 Unauthorised
 *      {
 *          "success": false
 *          "error": {
 *              "message": "Invalid appId or appSecret"
 *              "status": 401
 *              "timestamp": 1473756023136
 *              "type": "Authorisation Error"
 *          }
 *      }
 */
router.put('/', (req, res) => {
    const emitter = new Emitter(req, res);

    for(let i in req.body) {
        if(['responseURL', 'name'].indexOf(i) !== -1) {
            req.app[i] = req.body[i];
        }
    }

    req.app.save(err => {
        if(err) {
            return emitter.sendError(new CustomErrors.InvalidRequestData());
        }

        return emitter.sendData('update success');
    });
});

module.exports = router;