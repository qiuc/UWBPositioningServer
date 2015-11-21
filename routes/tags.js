var express     = require('express');
var router      = express.Router();
var errortrans  = require('../uwbpositioning/task').errorTransformer;
var Tag         = require('../uwbpositioning/task').Tag;

/**
 * @api {get} /tags 获取Tag列表
 * @apiVersion 0.0.1
 * @apiName GetTags
 * @apiGroup Tag
 *
 * @apiDescription 只有在Tag列表中的Tag才会解析定位信息. \
 * Tag告警规则分为2类, 一类为in, 进入该区域时告警, 一类为out, 离开该区域时告警. \
 * 区域定义为由一个坐标序列所包围的直线连接范围.
 *
 * @apiSuccess {String}  id               Tag设备号
 * @apiSuccess {String}  status           online/offline, 标志该Tag是否在线
 * @apiSuccess {String}  group            Tag最近一次所在的Anchor分组id
 * @apiSuccess {Object}  alarm            告警规则
 *
 */
router.get('/', function(req, res) {
  Tag.index(function(err, tags) {
    if (err) {
      return errortrans(res, err);
    }

    res.json(tags);
  });
});

/**
 * @api {post} /tags 新建Tag
 * @apiVersion 0.0.1
 * @apiName CreateTag
 * @apiGroup Tag
 *
 * @apiDescription 新建Tag时必须指定其设备号,与真实的Tag编号一致. \
 * 所有的Tag设备号不可从复.
 *
 * @apiParam {Integer}  id               Anchor设备号
 * @apiParam {Object}   alarm            告警规则
 *
 * @apiSuccess {String} message          tag created
 *
 */
router.post('/', function(req, res) {
  req.checkBody('id', 'Invalid tag id')
      .notEmpty().withMessage('tag id is required')
      .isInt({ min: 1, max: 255 }).withMessage('tag id must be an integer from 1 to 255');

  var errors = req.validationErrors();
  if (errors) {
    var validateError = {message: "tag create error", errors: errors};
    res.status(400).json(validateError);
    return;
  }

  Tag.create(req.body, function(err) {
    if(err) {
      return errortrans(res, err);
    }

    res.json({message: 'tag created'});
  });
});

/**
 * @api {get} /tags/:id 获取单个Tag的信息
 * @apiVersion 0.0.1
 * @apiName getTag
 * @apiGroup Tag
 *
 * @apiDescription 获取单个Tag的信息
 *
 * @apiParam {String}    id               Tag设备号
 *
 * @apiSuccess {String}  id               Tag设备号
 * @apiSuccess {String}  status           online/offline, 标志该Tag是否在线
 * @apiSuccess {String}  group            Tag最近一次所在的Anchor分组id
 * @apiSuccess {Object}  alarm            告警规则
 *
 */

router.get('/:id', function(req, res) {
  req.checkParams('id', 'Invalid tag id')
      .notEmpty().withMessage('tag id is required')
      .isInt({ min: 1, max: 255 }).withMessage('tag id must be an integer from 1 to 255');

  var errors = req.validationErrors();
  if (errors) {
    var validateError = {message: "tag show error", errors: errors};
    res.status(400).json(validateError);
    return;
  }

  Tag.show(req.params.id, function(err, tag) {
    if(err) {
      return errortrans(res, err);
    }

    res.json(tag);
  });
});

/**
 * @api {delete} /tags/:id 删除Tag
 * @apiVersion 0.0.1
 * @apiName deleteTag
 * @apiGroup Tag
 *
 * @apiDescription 删除Tag
 *
 * @apiParam {String}  id              Tag设备号
 *
 * @apiSuccess {String} message        tag deleted
 *
 */

router.delete('/:id', function(req, res) {
  req.checkParams('id', 'Invalid tag id')
      .notEmpty().withMessage('tag id is required')
      .isInt({ min: 1, max: 255 }).withMessage('tag id must be an integer from 1 to 255');

  var errors = req.validationErrors();
  if (errors) {
    var validateError = {message: "tag show error", errors: errors};
    res.status(400).json(validateError);
    return;
  }

  Tag.destroy(req.params.id, function(err) {
    if(err) {
      return errortrans(res, err);
    }

    res.json({message: 'tag deleted'});
  });
});

module.exports = router;
