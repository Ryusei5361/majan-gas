function AVERAGEMAXPOINTS(points) {

  // 取得してくるまでに時間がかかるっぽく、取得前にアクセスしようとするとエラーになるので、取得されるまで待つ
  if (points.length != 30) Utilities.sleep(100)
  // B3:D32などのような入力ミスの場合、知らせる
  if (points[0].length != 8) return "人数が足りません。"

  // 配列を転置する関数
  const transpose = a => a[0].slice().map((_, c) => a.map(r => r[c]));
  // 最大値を返す関数
  const aryMax = function (a, b) {return Math.max(a, b);}

  // 配列を転置
  let pts = transpose(points)
  // 最高得点格納配列
  let maxPts = Array(4).fill(0)
  // それぞれの最高得点を求める
  for (let i = 0; i < 4; i++) {
    maxPts[i] = pts[i].reduce(aryMax)
  }

  // 平均得点格納配列、半荘数
  let avePts = Array(4).fill(0)
  let hantyan = 0
  for (let j = 0; j < points.length; j++) {
    if (points[j].every(a => a == 0)) {
      break
    }
    hantyan += 1
    avePts = avePts.map((x, idx) => {return (x + points[j][idx])})
  }
  // それぞれの合計得点を半荘数で割り、平均を求める
  avePts = avePts.map(x => {return Math.round(x / hantyan)})

  return transpose([avePts, maxPts])
}
