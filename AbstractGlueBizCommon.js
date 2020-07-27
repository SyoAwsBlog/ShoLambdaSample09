/*
業務毎（機能枚）に共通処理な処理などを、この層に実装する。

例えば
・API Gateway から呼び出すLambdaに共通
・SQSを呼び出すLambdaに共通
など、用途毎に共通となるような処理は、この層に実装すると良い

written by syo
http://awsblog.physalisgp02.com
*/
module.exports = function AbstractGlueBizCommon() {
  // 疑似的な継承関係として親モジュールを読み込む
  var superClazzFunc = require("./AbstractBizCommon");
  // prototypeにセットする事で継承関係のように挙動させる
  AbstractGlueBizCommon.prototype = new superClazzFunc();

  var TARGET_CRAWLER_NAME = "";
  if (process && process.env && process.env.TargetCrawlerName) {
    TARGET_CRAWLER_NAME = process.env.TargetCrawlerName;
  }

  // 処理の実行
  function* executeBizUnitCommon(event, context, bizRequireObjects) {
    var base = AbstractGlueBizCommon.prototype.AbstractBaseCommon;
    try {
      base.writeLogTrace("AbstractGlueBizCommon# executeBizUnitCommon : start");

      // 自動再実行ようの演算
      var reCallCount = event.reCallCount || 0;
      reCallCount += 1;
      event.reCallCount = reCallCount;

      // 読み込みモジュールの引き渡し
      AbstractGlueBizCommon.prototype.RequireObjects = bizRequireObjects;

      // 親の業務処理を実行
      return yield AbstractGlueBizCommon.prototype.executeBizCommon(
        event,
        context,
        bizRequireObjects
      );
    } catch (err) {
      base.printStackTrace(err);
      throw err;
    } finally {
      base.writeLogTrace("AbstractGlueBizCommon# executeBizUnitCommon : end");
    }
  }
  AbstractGlueBizCommon.prototype.executeBizUnitCommon = executeBizUnitCommon;

  AbstractGlueBizCommon.prototype.AbstractBaseCommon.getTargetCrawlerName = function () {
    var base = AbstractGlueBizCommon.prototype.AbstractBaseCommon;
    try {
      base.writeLogTrace("AbstractGlueBizCommon# getTargetCrawlerName : start");
      return TARGET_CRAWLER_NAME;
    } catch (err) {
      base.printStackTrace(err);
      throw err;
    } finally {
      base.writeLogTrace("AbstractGlueBizCommon# getTargetCrawlerName : end");
    }
  }.bind(AbstractGlueBizCommon);

  /*
  業務前処理（オーバーライドのサンプル）

  API Gatewayからの呼び出しなど、Lambda実行引数を、後続処理で呼び出しやすくする為に、
  初期処理で返却しておく事で、getFirstIndexObjectで取得できるようになる。

  @override
  @param args 各処理の結果を格納した配列
  */
  AbstractGlueBizCommon.prototype.AbstractBaseCommon.beforeMainExecute = function (
    args
  ) {
    var base = AbstractGlueBizCommon.prototype.AbstractBaseCommon;
    try {
      base.writeLogTrace("AbstractGlueBizCommon# beforeMainExecute : start");

      // tasksの先頭には event が格納されてくる。
      // 後続のtaskで参照しやすくするには、最初のタスクで
      // eventを返却しておくと良い
      var event = args;
      return event;
    } catch (err) {
      base.printStackTrace(err);
      throw err;
    } finally {
      base.writeLogTrace("AbstractGlueBizCommon# beforeMainExecute : end");
    }
  }.bind(AbstractGlueBizCommon.prototype.AbstractBaseCommon);

  return {
    executeBizUnitCommon,
    AbstractGlueBizCommon,
    AbstractBizCommon: AbstractGlueBizCommon.prototype,
    AbstractBaseCommon: AbstractGlueBizCommon.prototype.AbstractBaseCommon,
  };
};
