function CALCPOINTS(points, rankPoints, diffView) {

  // 取得してくるまでに時間がかかるっぽく、取得前にアクセスしようとするとエラーになるので、取得されるまで待つ
  if (points.length != 30 || rankPoints[0].length != 4) Utilities.sleep(100)

  // "結果"というシートを取得
  const majanSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  const majanSheet = majanSpreadsheet.getSheetByName('結果')
  // 返しと順位点を途中で変えたくなったら、関数内で取ってこないで、引数に渡すようにする。
  // 返しを取得
  const kaeshi = majanSheet.getRange('M4').getValue()

  // 風を保持しておく行列
  let kaze = Array(points.length).fill().map(() => Array(4).fill(0))
  for (let i = 0; i < points.length; i++) {
    // points配列から風だけを取得
    kaze[i] = points[i].filter(n => n%2 !== 0)
    // 処理しやすいように数値に変換
    if (kaze[i].length !== 0) {
      for (let j = 0; j< kaze[i].length; j++) {
        if (kaze[i][j] === '東') kaze[i].splice(j, 1, '0')
        else if (kaze[i][j] === '南') kaze[i].splice(j, 1, '1')
        else if (kaze[i][j] === '西') kaze[i].splice(j, 1, '2')
        else if (kaze[i][j] === '北') kaze[i].splice(j, 1, '3')
      }
    }
    // 風を除いたpoints配列を作成
    for (let k = 0; k< 4; k++) {
      points[i].splice(k+1, 1);
    }
    // points配列をそのまま利用したいため、計算する前に順位を把握しておく
    // 降順にソートし、sortedに代入。points配列はそのまま利用したいため、sliceでコピー
    let sorted = points[i].slice().sort(function(a, b){return b - a});
    // 何位か判定
    let ranks = points[i].map(function(x){return sorted.indexOf(x)});
    // 1行すべて無記入の場合、その行を飛ばす
    if (points[i].every(a => a === '')) continue
    if (points[i].some(a => a === '')) {
      points[i] = ["点不足", , , ]
      continue
    }
    if (points[i].reduce((sum, element) => sum + element, 0) !== 100000) {
      points[i] = ["合計点不足", , , ]
      continue
    }
    // 同じ順位がいたときの処理
    // 起家に近い方を高い順位とする
    if (isDuplicated(points[i])) {
      if (kaze[i].length !== 4) {
        points[i] = ["風不足", , , ]
        continue
      }
      if (isDuplicated(kaze[i])) {
        points[i] = ["風重複", , , ]
        continue
      }
      let idxs = []; // 同じ順位の人のインデックスを保持しておくための配列
      let dubVal = duplicatedValue(ranks);  // かぶっている順位を取得
      ranks.map(function(val, idx) {
            if (val === dubVal) idxs.push(idx)
        })
      // 起家から遠い方を低い順位にする
      kaze[i][idxs[0]] > kaze[i][idxs[1]] ? ranks[idxs[0]] = dubVal+1: ranks[idxs[1]] = dubVal+1
    }

    // 五捨六入して順位点を加算
    for (let j = 0; j < points[i].length; j++) {
      points[i][j] = Math.round(Math.abs(points[i][j]/1000) - 0.1) * Math.sign(points[i][j]) - kaeshi/1000;
      points[i][j] += rankPoints[0][ranks[j]]
    }

    // 誤差が生じた場合、誤差をトップに押し付ける
    const diff = points[i].reduce((sum, element) => sum + element, 0)
    // diffViewで誤差の処理を行うか決める
    if (!diffView && diff != 0) {
      const top = points[i].reduce((x, y) => {return Math.max(x, y)}) // トップの得点を取得
      const topIdx = points[i].indexOf(top) // トップの得点のインデックスを取得
      points[i][topIdx] += -diff // トップの得点に誤差を加算
      // 一行で書くと↓
      // points[i][points[i].indexOf(points[i].reduce((x, y) => {return Math.max(x, y)}))] += Math.abs(diff)
    } 
  }

  return points
}

// 重複があるか判定する関数
function isDuplicated(elements) {
  // Setを使って、配列の要素を一意にする
  const setElements = new Set(elements);
  return setElements.size !== elements.length;
}

// 重複している値を返す関数
function duplicatedValue(elements) {
  for (let i = 0; i < elements.length-1; i++) {
    for (let j = i+1; j < elements.length; j++) {
      if (elements[i] === elements[j]) return elements[i]
    }
  }
}
