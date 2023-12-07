function CALCPOINTS(points) {

  // "結果"というシートを取得
  const majanSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  const majanSheet = majanSpreadsheet.getSheetByName('結果')
  // 返しと順位点を途中で変えたくなったら、関数内で取ってこないで、引数に渡すようにする。
  // 返しを取得
  const kaeshi = majanSheet.getRange('M4').getValue()
  // 順位点を取得
  let rankPoints = majanSheet.getRange('M1:P1').getValues()[0]

  return points[0].length

  // 取得してくるまでに時間がかかるっぽく、取得前にアクセスしようとするとエラーになるので、取得されるまで待つ
  if (points[0].length != 8 || rankPoints.length != 4) Utilities.sleep(100)

  // 一つでも空欄があれば終了
  if (points[0].some(a => a === '')) {
    return
  }

  // points配列をそのまま利用したいため、計算する前に順位を把握しておく
  // 降順にソートし、sortedに代入。points配列はそのまま利用したいため、sliceでコピーする
  let sorted = points[0].slice().sort(function(a, b){return b - a});
  // 何位か判定
  let ranks = points[0].slice().map(function(x){return sorted.indexOf(x)});

  // 同じ順位がいたときの処理
  // i) 1, 1, 3, 4
  if (ranks.filter(element => element == 0).length == 2) rankPoints = [25, 25, -10, -30]
  // ii) 1, 2, 2, 3
  else if (ranks.filter(element => element == 1).length == 2) rankPoints = [50, 5, 5, -30]
  // iii) 1, 2, 3, 3
  else if (ranks.filter(element => element == 2).length == 2) rankPoints = [50, 10, -5, -5]

  // 五捨六入して清算
  for (let i = 0; i < points[0].length; i++) {
    points[0][i] = Math.round(Math.abs(points[0][i]/1000) - 0.1) * Math.sign(points[0][i]) - kaeshi/1000;
  }

  // 順位点を加算
  for (let j = 0; j < ranks.length; j++) {
    points[0][j] += rankPoints[ranks[j]]
  }

  // 最大値を返す関数
  const aryMax = function (a, b) {return Math.max(a, b);}
  // 誤差
  const diff = points[0].reduce((sum, element) => sum + element, 0)
  // 誤差が生じた際に、誤差をトップに押し付ける
  // if (diff != 0) {
  //   const top = points[0].reduce(aryMax) // トップの得点を取得
  //   const topIdx = points[0].indexOf(top) // トップの得点のインデックスを取得
  //   points[0][topIdx] += Math.abs(diff) // トップの得点に誤差を加算
  //   // 一行で書くと↓
  //   // points[0][points[0].indexOf(points[0].reduce(aryMax))] += Math.abs(diff)
  // } 

  return points
}

// 重複があるか判定する関数
function isDuplicated(elements) {
  // Setを使って、配列の要素を一意にする
  const setElements = new Set(elements);
  return setElements.size !== elements.length;
}