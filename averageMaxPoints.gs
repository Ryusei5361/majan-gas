function AVERAGEMAXPOINTS(points) {

  // 取得してくるまでに時間がかかるっぽく、取得前にアクセスしようとするとエラーになるので、取得されるまで待つ
  if (points.length != 30) Utilities.sleep(100)
  // B3:D32などのような入力ミスの場合、知らせる
  if (points[0].length != 8) return "人数が足りません。"

  // 風を取得。今のところ使わないのでコメントアウト
  // let kaze = points[0].filter(n => n%2 !== 0)

  // 風を除いたpoints配列を作成
  for (let i = 0; i< points.length; i++) {
    // 1行すべて0であれば終了
    if (points[i].every(a => a == 0)) break
    for (let j = 0; j < 4; j++)
      points[i].splice(j+1, 1)
  }
  
  // 平均得点格納配列、半荘数
  let avePts = Array(4).fill(0)
  let hantyan = 0
  for (let i = 0; i < points.length; i++) {
    // 1行すべて0であれば終了
    if (points[i].every(a => a == 0)) break
    hantyan += 1
    avePts = avePts.map((x, idx) => {return (x + points[i][idx])})
  }
  // それぞれの合計得点を半荘数で割り、平均を求める
  if (hantyan != 0)  avePts = avePts.map(x => {return Math.round(x / hantyan)})

  // 配列を転置する関数
  const transpose = a => a[0].slice().map((_, c) => a.map(r => r[c]));
  // 配列を転置
  let pts = transpose(points)
  // 最高得点格納配列
  let maxPts = Array(4).fill(0)
  // それぞれの最高得点を求める
  for (let i = 0; i < 4; i++) {
    maxPts[i] = pts[i].reduce((x, y) => {return Math.max(x, y)})
  }

  return transpose([avePts, maxPts])
}
