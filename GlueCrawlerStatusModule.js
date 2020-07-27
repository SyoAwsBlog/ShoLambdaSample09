/*
処理固有に必要な処理などを、この層に実装する。

テストや挙動確認を含めたコードをコメントアウト込みで、
サンプルとして記述する。

written by syo
http://awsblog.physalisgp02.com
*/
module.exports = function GlueCrawlerStatusModule() {
  // 疑似的な継承関係として親モジュールを読み込む
  var superClazzFunc = new require("./AbstractGlueBizCommon.js");
  // prototypeにセットする事で継承関係のように挙動させる
  GlueCrawlerStatusModule.prototype = new superClazzFunc();

  // 処理の実行
  function* execute(event, context, bizRequireObjects) {
    var base = GlueCrawlerStatusModule.prototype.AbstractBaseCommon;
    try {
      base.writeLogTrace("GlueCrawlerStatusModule# execute : start");

      // 親の業務処理を実行
      return yield GlueCrawlerStatusModule.prototype.executeBizUnitCommon(
        event,
        context,
        bizRequireObjects
      );
    } catch (err) {
      base.printStackTrace(err);
      throw err;
    } finally {
      base.writeLogTrace("GlueCrawlerStatusModule# execute : end");
    }
  }

  /*
  業務メイン処理（オーバーライドのサンプル）

  @override
  @param args 各処理の結果を格納した配列
  */
  GlueCrawlerStatusModule.prototype.AbstractBaseCommon.businessMainExecute = function (
    args
  ) {
    var base = GlueCrawlerStatusModule.prototype.AbstractBaseCommon;
    try {
      base.writeLogTrace(
        "GlueCrawlerStatusModule# businessMainExecute : start"
      );

      // 基底処理を実行する事で、Lambda実行引数のeventを取り出せる
      var event = base.getFirstIndexObject(args);

      var targetCrawlerName = base.getTargetCrawlerName();

      var param = {
        Name: targetCrawlerName,
      };

      // Promiseを戻す関数として実装可能
      return new Promise(function (resolve, reject) {
        base.RequireObjects.Glue.getCrawler(param, function (err, data) {
          if (err) {
            base.printStackTrace(err);
            reject(err);
          } else {
            base.writeLogTrace(
              "GlueCrawlerStatusModule# status result : " + JSON.stringify(data)
            );
            resolve(data);
          }
        });
      });
    } catch (err) {
      base.printStackTrace(err);
      throw err;
    } finally {
      base.writeLogTrace("GlueCrawlerStatusModule# businessMainExecute : end");
    }
  }.bind(GlueCrawlerStatusModule.prototype.AbstractBaseCommon);

  /*
  業務メイン処理（オーバーライドのサンプル）

  @override
  @param args 各処理の結果を格納した配列
  */
  GlueCrawlerStatusModule.prototype.AbstractBaseCommon.afterMainExecute = function (
    args
  ) {
    var base = GlueCrawlerStatusModule.prototype.AbstractBaseCommon;
    try {
      base.writeLogTrace("GlueCrawlerStatusModule# afterMainExecute : start");

      // 基底処理を実行する事で、Lambda実行引数のeventを取り出せる
      var event = base.getFirstIndexObject(args);

      var result = base.getLastIndexObject(args);

      var rtnStr = "FAILED";

      if ("Crawler" in result && "State" in result.Crawler) {
        rtnStr = result.Crawler.State;
      }

      // Promiseを戻す関数として実装可能
      return new Promise(function (resolve, reject) {
        resolve(rtnStr);
      });
    } catch (err) {
      base.printStackTrace(err);
      throw err;
    } finally {
      base.writeLogTrace("GlueCrawlerStatusModule# afterMainExecute : end");
    }
  }.bind(GlueCrawlerStatusModule.prototype.AbstractBaseCommon);

  /*
  CrawlerのStatusをStepFunctionに返却する為、取得したステータスを戻り値にする

  @param event Lambdaの起動引数：event
  @param context Lambdaの起動引数：context
  @param results 処理結果配列
  */
  GlueCrawlerStatusModule.prototype.AbstractBaseCommon.afterAllTasksExecute = function (
    event,
    context,
    results
  ) {
    var base = GlueCrawlerStatusModule.prototype.AbstractBaseCommon;
    try {
      base.writeLogTrace(
        "GlueCrawlerStatusModule# afterAllTasksExecute : start"
      );

      var statusValue = base.getLastIndexObject(results);

      return statusValue;
    } catch (err) {
      base.printStackTrace(err);
      throw err;
    } finally {
      base.writeLogTrace("GlueCrawlerStatusModule# afterAllTasksExecute : end");
    }
  }.bind(GlueCrawlerStatusModule.prototype.AbstractBaseCommon);

  return {
    execute,
  };
};
