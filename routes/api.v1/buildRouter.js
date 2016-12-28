const path = require('path');
const fs = require('fs-extra');
const async = require('async');
const exec = require('child_process').exec;

const router = require('express').Router();
const Emitter = require('../../utils/emitter');
const UniqueID = require('../../utils/UniqueID');
const CustomErrors = require('../../utils/errors');
const builderQueue = require('../../utils/builderQueue');


const MongoConnection = require('../../mongoose/connection');
const App = MongoConnection.model('App');

/**
 * @api {post} /api/v1/project Request Build Project
 * @apiName Build Project
 * @apiGroup Project
 *
 * @apiHeader (Authentication) {String} app-key App Key.
 * @apiHeader (Authentication) {String} app-secret App Secret.
 *
 * @apiParam (Project) {String} project.userId Users unique ID
 * @apiParam (Project) {String} project.appId User Project unique ID
 * @apiParam (Project) {String} project.url Project URL to open
 * @apiParam (Project) {String} project.appName Project name
 *
 * @apiParam (Android) {String} project.android.package Project package
 *
 * @apiParam (KeyStore) {String} project.android.keyStore.alias KeyStore alias
 * @apiParam (KeyStore) {String} project.android.keyStore.aliasPassword KeyStore alias password
 * @apiParam (KeyStore) {String} project.android.keyStore.name KeyStore name
 * @apiParam (KeyStore) {String} project.android.keyStore.password KeyStore password
 * @apiParam (KeyStore) {String} project.android.keyStore.countryCode Publisher Country Code
 * @apiParam (KeyStore) {String} project.android.keyStore.state Publisher State
 * @apiParam (KeyStore) {String} project.android.keyStore.city Publisher City
 * @apiParam (KeyStore) {String} project.android.keyStore.organization Publisher Organization
 * @apiParam (KeyStore) {String} project.android.keyStore.firstLastName Publisher First and Last name
 *
 * @apiSuccess {String} data "Build added on queue.
 *
 * @apiSuccessExample {json} Success-Response
 *     200 OK
 *     {
 *          "success": true
 *          "data": ""Build added on queue"
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
 *
 * @apiErrorExample {json} Bad Request:
 *      400 Bad Request
 *      {
 *          "success": false
 *          "error": {
 *              "message": "Invalid request data. Check api documentation"
 *              "status": 400
 *              "timestamp": 1473756023136
 *              "type": "Bad Request"
 *          }
 *      }
 */
router.post('/', (req, res) => {
    const emitter = new Emitter(req, res);

    const project = req.userApp.toObject();
    project.responseURL = req.app.responseURL;
    project.files = req.files;
    project.buildId = UniqueID.v16();
    console.log(project);

    builderQueue.requestBuild(project, (err, status) => {
        if (err) {
            return emitter.sendError(new CustomErrors.InvalidRequestData());
        }

        return emitter.sendData({
            buildId: project.buildId,
            queueIndex: status.prev
        });
    })
});


/**
 * @api {post} /api/v1/project Request Build Project
 * @apiName Build Project
 * @apiGroup Project
 *
 * @apiHeader (Authentication) {String} app-key App Key.
 * @apiHeader (Authentication) {String} app-secret App Secret.
 *
 * @apiParam (KeyStore) {String} buildId buildId
 *
 * @apiSuccess {String} data removed.
 *
 * @apiSuccessExample {json} Success-Response
 *     200 OK
 *     {
 *          "success": true
 *          "data": ""Build added on queue"
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
 *
 * @apiErrorExample {json} Bad Request:
 *      400 Bad Request
 *      {
 *          "success": false
 *          "error": {
 *              "message": "Invalid request data. Check api documentation"
 *              "status": 400
 *              "timestamp": 1473756023136
 *              "type": "Bad Request"
 *          }
 *      }
 */
router.delete('/', (req, res) => {
    const emitter = new Emitter(req, res);

    if(builderQueue.removeByBuildID(req.body.buildId)) {
        return emitter.sendData('removed');
    }

    return emitter.sendError(new CustomErrors.InvalidRequestData());
});

module.exports = router;