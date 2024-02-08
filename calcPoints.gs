function CALCPOINTS(points) {

  // "結果"というシートを取得
  const majanSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  const majanSheet = majanSpreadsheet.getSheetByName('結果')
  // 返しと順位点を途中で変えたくなったら、関数内で取ってこないで、引数に渡すようにする。
  // 返しを取得
  const kaeshi = majanSheet.getRange('M4').getValue()
  // 順位点を取得
  let rankPoints = majanSheet.getRange('M1:P1').getValues()[0]

  // 取得してくるまでに時間がかかるっぽく、取得前にアクセスしようとするとエラーになるので、取得されるまで待つ
  if (points[0].length != 8 || rankPoints.length != 4) Utilities.sleep(100)

  // 風を取得
  let order = points[0].filter(n => n%2 !== 0)
  if (order.length !== 0) {
    for (let i = 0; i< order.length; i++) {
      if (order[i] === '東') order.splice(i, 1, '0')
      else if (order[i] === '南') order.splice(i, 1, '1')
      else if (order[i] === '西') order.splice(i, 1, '2')
      else if (order[i] === '北') order.splice(i, 1, '3')
    }
  }

  // 風を除いたpoints配列を作成
  for (let i = 0; i< 4; i++) {
    points[0].splice(i+1, 1)
  }

  // 風を除いた点数だけの配列において一つでも空欄があれば終了
  if (points[0].some(a => a === '')) return

  // points配列をそのまま利用したいため、計算する前に順位を把握しておく
  // 降順にソートし、sortedに代入。points配列はそのまま利用したいため、sliceでコピーする
  let sorted = points[0].slice().sort(function(a, b){return b - a});
  // 何位か判定
  let ranks = points[0].slice().map(function(x){return sorted.indexOf(x)});

  // 起家に近い方を高い順位とする
  // 同じ順位がいたときの処理
  if (isDuplicated(points[0])) {
    if (isDuplicated(order)) return "風が重複しています。"
    if (order.length !== 4) return "風がすべて入力されていません。"
    let idxs = [] // 同じ順位の人のインデックスを格納する配列
    // i) 1, 1, 3, 4
    if (ranks.filter(element => element == 0).length == 2) {
      // 同順位の人たちのインデックスを取得
      ranks.map(function(val, idx) {
          if (val === 0) idxs.push(idx)
      })
      order[idxs[0]] < order[idxs[1]] ? ranks[idxs[1]] = 1: ranks[idxs[0]] = 1
    }
    // ii) 1, 2, 2, 3
    else if (ranks.filter(element => element == 1).length == 2) {
      // 同順位の人たちのインデックスを取得
      ranks.map(function(val, idx) {
          if (val === 1) idxs.push(idx)
      })
      order[idxs[0]] < order[idxs[1]] ? ranks[idxs[1]] = 2: ranks[idxs[0]] = 2
      // return ranks
    }
    // iii) 1, 2, 3, 3
    else if (ranks.filter(element => element == 2).length == 2) {
      // 同順位の人たちのインデックスを取得
      ranks.map(function(val, idx) {
          if (val === 2) idxs.push(idx)
      })
      order[idxs[0]] < order[idxs[1]] ? ranks[idxs[1]] = 3: ranks[idxs[0]] = 3
    }
  }

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
  if (diff != 0) {
    const top = points[0].reduce(aryMax) // トップの得点を取得
    const topIdx = points[0].indexOf(top) // トップの得点のインデックスを取得
    points[0][topIdx] += Math.abs(diff) // トップの得点に誤差を加算
    // 一行で書くと↓
    // points[0][points[0].indexOf(points[0].reduce(aryMax))] += Math.abs(diff)
  } 

  return points
}

// 重複があるか判定する関数
function isDuplicated(elements) {
  // Setを使って、配列の要素を一意にする
  const setElements = new Set(elements);
  return setElements.size !== elements.length;
}