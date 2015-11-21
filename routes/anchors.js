var express   = require('express');
var router    = express.Router();
var errortrans  = require('../uwbpositioning/task').errorTransformer;
var Anchor    = require('../uwbpositioning/task').Anchor;

/**
 * @api {get} /anchors 获取Anchor列表
 * @apiVersion 0.0.1
 * @apiName GetAnchors
 * @apiGroup Anchor
 *
 * @apiDescription 只有在Anchor列表中的Anchor所发送的UDP报文才能被服务器解析.
 *
 * @apiSuccess {String}  id               Anchor设备号
 * @apiSuccess {String}  group            分组id
 * @apiSuccess {Object}  distances        Anchor到同组其他Anchor之间的距离集合
 * @apiSuccess {Array}   position         Anchor坐标
 *
 */
router.get('/', function(req, res) {
  Anchor.index(function(err, anchors) {
    if (err) {
      return errortrans(res, err);
    }

    res.json(anchors);
  });
});

/**
 * @api {post} /anchors 新建Anchor
 * @apiVersion 0.0.1
 * @apiName CreateAnchor
 * @apiGroup Anchor
 *
 * @apiDescription 新建Anchor时必须指定其设备号,与真实的Anchor编号一致. \
 * 所有的Anchor设备号不可从复,无论是否在同一分组当中.
 *
 * @apiParam {Integer}  id               Anchor设备号
 * @apiParam {String}   [group]          分组id, 不填默认为default
 * @apiParam {Object}   [distances]      Anchor到同组其他Anchor之间的距离集合
 * @apiParam {Array}    [position]       Anchor坐标, 为2维数组
 *
 * @apiSuccess {String} message          anchor created
 *
 */
router.post('/', function(req, res) {
  req.checkBody('id', 'Invalid anchor id')
      .notEmpty().withMessage('anchor id is required')
      .isInt({ min: 1, max: 255 }).withMessage('anchor id must be an integer from 1 to 255');

  if(req.body.group !== 'default') {
    req.checkBody('group', 'Invalid anchor group')
        .optional()
        .isUUID(4).withMessage('Invalid anchor group');
  }

  req.checkBody('position', 'Invalid anchor position')
      .isArray().withMessage('anchor position must be 2-d array');

  var errors = req.validationErrors();
  if (errors) {
    var validateError = {message: "anchor create error", errors: errors};
    res.status(400).json(validateError);
    return;
  }

  Anchor.create(req.body, function(err) {
    if(err) {
      return errortrans(res, err);
    }

    if(!req.body.hasOwnProperty('position')) {
      return res.json({message: 'anchor created'});
    }

    Anchor.setPosition(req.body.id, req.body.position, function(err) {
      if(err) {
        return errortrans(res, err);
      }

      if(!req.body.hasOwnProperty('distances')) {
        return res.json({message: 'anchor created'});
      }

      Anchor.setDistances(req.body.id, req.body.distances, function(err) {
        if(err) {
          return errortrans(res, err);
        }

        res.json({message: 'anchor created'});
      });
    });
  });
});

/**
 * @api {get} /anchors/:id 获取单个Anchor的信息
 * @apiVersion 0.0.1
 * @apiName getAnchor
 * @apiGroup Anchor
 *
 * @apiDescription 获取单个Anchor的信息
 *
 * @apiParam {String}    id               Anchor设备号
 *
 * @apiSuccess {String}  id               Anchor设备号
 * @apiSuccess {String}  group            分组id
 * @apiSuccess {Object}  distances        Anchor到同组其他Anchor之间的距离集合
 * @apiSuccess {Array}   position         Anchor坐标
 *
 */

router.get('/:id', function(req, res) {
  req.checkParams('id', 'Invalid anchor id')
      .notEmpty().withMessage('anchor id is required')
      .isInt({ min: 1, max: 255 }).withMessage('anchor id must be an integer from 1 to 255');

  var errors = req.validationErrors();
  if (errors) {
    var validateError = {message: "anchor show error", errors: errors};
    res.status(400).json(validateError);
    return;
  }

  Anchor.show(req.params.id, function(err, anchor) {
    if(err) {
      return errortrans(res, err);
    }

    res.json(anchor);
  });
});

/**
 * @api {delete} /anchors/:id 删除Anchor
 * @apiVersion 0.0.1
 * @apiName deleteAnchor
 * @apiGroup Anchor
 *
 * @apiDescription 删除Anchor
 *
 * @apiParam {String}  id              Anchor设备号
 *
 * @apiSuccess {String} message        anchor deleted
 *
 */

router.delete('/:id', function(req, res) {
  req.checkParams('id', 'Invalid anchor id')
      .notEmpty().withMessage('anchor id is required')
      .isInt({ min: 1, max: 255 }).withMessage('anchor id must be an integer from 1 to 255');

  var errors = req.validationErrors();
  if (errors) {
    var validateError = {message: "anchor delete error", errors: errors};
    res.status(400).json(validateError);
    return;
  }

  Anchor.destroy(req.params.id, function(err) {
    if(err) {
      return errortrans(res, err);
    }

    res.json({message: 'anchor deleted'});
  });
});

module.exports = router;
