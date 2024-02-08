function CALCPOINTS(points, rankPoints, diffView) {

  // "結果"というシートを取得
  const majanSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  const majanSheet = majanSpreadsheet.getSheetByName('結果')
  // 返しと順位点を途中で変えたくなったら、関数内で取ってこないで、引数に渡すようにする。
  // 返しを取得
  const kaeshi = majanSheet.getRange('M4').getValue()
  // 順位点を取得
  rankPoints = rankPoints[0]


  // 取得してくるまでに時間がかかるっぽく、取得前にアクセスしようとするとエラーになるので、取得されるまで待つ
  if (points[0].length != 8 || rankPoints.length != 4) Utilities.sleep(100)

  // 風を取得
  let kaze = points[0].filter(n => n%2 !== 0)
  // 処理しやすいように数値に変換
  if (kaze.length !== 0) {
    for (let i = 0; i< kaze.length; i++) {
      if (kaze[i] === '東') kaze.splice(i, 1, '0')
      else if (kaze[i] === '南') kaze.splice(i, 1, '1')
      else if (kaze[i] === '西') kaze.splice(i, 1, '2')
      else if (kaze[i] === '北') kaze.splice(i, 1, '3')
    }
  }

  // 風を除いたpoints配列を作成
  for (let i = 0; i< 4; i++) {
    points[0].splice(i+1, 1);
  }

  // 一つでも空欄があれば終了
  if (points[0].some(a => a === '')) return
  // 合計点が10万点でなければ知らせる
  if (points[0].reduce((sum, element) => sum + element, 0) !== 100000) return "点数が正しく入力されていません。"

  // points配列をそのまま利用したいため、計算する前に順位を把握しておく
  // 降順にソートし、sortedに代入。points配列はそのまま利用したいため、sliceでコピー
  let sorted = points[0].slice().sort(function(a, b){return b - a});
  // 何位か判定
  let ranks = points[0].map(function(x){return sorted.indexOf(x)});

  // 同じ順位がいたときの処理
  // 起家に近い方を高い順位とする
  if (isDuplicated(points[0])) {
    if (isDuplicated(kaze)) return "風が重複しています。"
    if (kaze.length !== 4) return "風がすべて入力されていません。"
    let idxs = []; // 同じ順位の人のインデックスを格納する配列
    let dubVal = duplicatedValue(ranks);  // かぶっている順位を取得
    ranks.map(function(val, idx) {
          if (val === dubVal) idxs.push(idx)
      })
    // 起家から遠い方を低い順位にする
    kaze[idxs[0]] > kaze[idxs[1]] ? ranks[idxs[0]] = dubVal+1: ranks[idxs[1]] = dubVal+1
  }

  // 五捨六入して清算
  for (let i = 0; i < points[0].length; i++) {
    points[0][i] = Math.round(Math.abs(points[0][i]/1000) - 0.1) * Math.sign(points[0][i]) - kaeshi/1000;
  }
  // 順位点を加算
  for (let j = 0; j < ranks.length; j++) {
    points[0][j] += rankPoints[ranks[j]]
  }

  // 誤差
  const diff = points[0].reduce((sum, element) => sum + element, 0)
  // 誤差が生じた際に、誤差をトップに押し付ける
  if (!diffView && diff != 0) {
    const top = points[0].reduce((x, y) => {return Math.max(x, y)}) // トップの得点を取得
    const topIdx = points[0].indexOf(top) // トップの得点のインデックスを取得
    points[0][topIdx] += -diff // トップの得点に誤差を加算
    // 一行で書くと↓
    // points[0][points[0].indexOf(points[0].reduce((x, y) => {return Math.max(x, y)}))] += Math.abs(diff)
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
