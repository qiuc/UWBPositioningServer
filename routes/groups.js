var express      = require('express');
var router       = express.Router();
var errortrans   = require('../uwbpositioning/task').errorTransformer;
var Group        = require('../uwbpositioning/task').Group;

/**
 * @api {get} /groups 获取Anchor分组列表
 * @apiVersion 0.0.1
 * @apiName GetGroups
 * @apiGroup Group
 *
 * @apiDescription 每个Anchor分组的id需要客户端在接入websocket后提交给服务器，\
 * 以便服务器判断应该提交哪个Anchor分组下的所有tag位置信息。\
 * 默认情况下只有一个Anchor分组，id为"default"。
 *
 * @apiSuccess {String}  id               分组id
 * @apiSuccess {Integer} maxAnchorNumber  该分组下所允许的最大Anchor数量
 *
 */
router.get('/', function(req, res) {
  Group.index(function(err, groups) {
    if (err) {
      return errortrans(res, err);
    }

    res.json(groups);
  });
});

/**
 * @api {post} /groups 新建Anchor分组
 * @apiVersion 0.0.1
 * @apiName CreateGroup
 * @apiGroup Group
 *
 * @apiDescription 新建Anchor分组，目前Anchor分组数量最大限制为16
 *
 * @apiParam {Integer}  maxAnchorNumber  该分组下所允许的最大Anchor数量
 *
 * @apiSuccess {String} message          anchor group created
 *
 */
router.post('/', function(req, res) {
  req.checkBody('maxAnchorNumber', 'Invalid maxAnchorNumber')
      .notEmpty().withMessage('maxAnchorNumber is required')
      .isInt({ min: 1, max: 16 }).withMessage('maxAnchorNumber must be an integer from 1 to 16');

  var errors = req.validationErrors();
  if (errors) {
    var validateError = {message: "anchor group create error", errors: errors};
    res.status(400).json(validateError);
    return;
  }

  req.sanitizeBody('maxAnchorNumber').toInt();
  Group.create(req.body, function(err) {
    if(err) {
      return errortrans(res, err);
    }

    res.json({message: 'anchor group created'});
  });
});

/**
 * @api {get} /groups/:id 获取单个Anchor分组的信息
 * @apiVersion 0.0.1
 * @apiName getGroup
 * @apiGroup Group
 *
 * @apiDescription 获取单个Anchor分组的信息
 *
 * @apiParam {String}    id             分组id
 *
 * @apiSuccess {String}  id             分组id
 * @apiSuccess {Integer} maxAnchorNumber  该分组下所允许的最大Anchor数量
 *
 */

router.get('/:id', function(req, res) {

  if(req.params.id !== 'default') {
    req.checkParams('id', 'Invalid group id')
        .notEmpty().withMessage('group id is required')
        .isUUID(4).withMessage('Invalid group id');

    var errors = req.validationErrors();
    if (errors) {
      var validateError = {message: "anchor group show error", errors: errors};
      res.status(400).json(validateError);
      return;
    }
  }
  Group.show(req.params.id, function(err, group) {
    if(err) {
      return errortrans(res, err);
    }

    res.json(group);
  });
});

/**
 * @api {delete} /groups/:id 删除Anchor分组
 * @apiVersion 0.0.1
 * @apiName deleteGroup
 * @apiGroup Group
 *
 * @apiDescription 删除Anchor分组时如果该分组下有anchor,将无法删除,需将该分组下的所有anchor删除或移到别的分组才能够继续操作.
 * default分组无法删除
 *
 * @apiParam {String}  id             分组id
 *
 * @apiSuccess {String} message       anchor group deleted
 *
 */

router.delete('/:id', function(req, res) {
  req.checkParams('id', 'Invalid group id')
      .notEmpty().withMessage('group id is required')
      .isUUID(4).withMessage('Invalid group id');

  var errors = req.validationErrors();
  if (errors) {
    var validateError = {message: "anchor group delete error", errors: errors};
    res.status(400).json(validateError);
    return;
  }

  Group.destroy(req.params.id, function(err) {
    if(err) {
      return errortrans(res, err);
    }

    res.json({message: 'anchor group deleted'});
  });
});

module.exports = router;
