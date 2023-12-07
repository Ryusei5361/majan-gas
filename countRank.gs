function COUNTRANK(points) {
  
  // "成績"というシートを取得
  const majanSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  const recordSheet = majanSpreadsheet.getSheetByName('成績')
  // 清算点を取得。とりあえず30半荘分
  let vals = recordSheet.getRange('B4:E33').getValues()

  // 誰が何位を何回取ったかの表。行が人で、列が順位。
  // let rankTable = [[0, 0, 0, 0, 0],[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
  let rankTable = Array(4).fill().map(() => Array(5).fill(0))

  // 取得してくるまでに時間がかかるっぽく、取得前にアクセスしようとするとエラーになるので、取得されるまで待つ
  if (points.length != 30 || vals.length != 30) Utilities.sleep(100)

  // 半荘数
  let hantyan = 0
  // 誰が何位を何回取ったか集計
  // 参考:https://goma.pw/article/2017-01-31-0/
  for (let i = 0; i < points.length; i++) { 
    // 1行すべて0であれば集計終了
    if (points[i].every(a => a == 0)) {
      break
    }
    hantyan += 1
    // 降順にソートし、sortedに代入
    let sorted = vals[i].slice().sort(function(a, b){return b - a});
    // それぞれ何位か判定
    let ranks = vals[i].slice().map(function(x){return sorted.indexOf(x)});
    // 何位を何回取ったか集計
    for (let j = 0; j < ranks.length; j++) {
      rankTable[j][ranks[j]] += 1
    }
  }

  // 平均順位
  for (let i = 0; i < 4; i++) {
    // 行ごとに何位を何回取ったか計算
    let a = rankTable[i].map((val, idx) => {return val*(idx+1)})
    // 順位の合計値を計算
    let b = a.reduce((sum, element) => sum + element, 0)
    // 半荘数で割り、平均順位を小数第二位まで求める
    if (b != 0) rankTable[i][4] = Math.round(b/hantyan*100)/100
    // 一行で書くと↓
    // rankTable[i][4] = Math.round(rankTable[i].map((val, idx) => {return val*(idx+1)}).reduce((sum, element) => sum + element, 0)/hantyan*100)/100
  }

  return rankTable
  
}
