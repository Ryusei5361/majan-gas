function RENTCOST(points, rate, nameAndCost, people) {

  // 取得してくるまでに時間がかかるっぽく、取得前にアクセスしようとするとエラーになるので、取得されるまで待つ
  if (points[0].length != 4 || rate.length !== 1 || nameAndCost.length === 0 || people[0].length != 8) Utilities.sleep(100)

  // 結果シートから取得してきた配列には空白が含まれているので、それらを削除
  for (let i = 0; i< people[0].length; i++) people[0].splice(i+1, 1);
  // 名前が4人分記入されていなければ知らせる
  if (people[0].some(a => a === '')) return "名前を入力してください。"

  // 場代と債務者を代入
  const rentCost = nameAndCost[0]
  const name = nameAndCost[1]

  // 債務者が空欄の場合、清算点をそのまま返す
  if (name == '') return points

  // 一人当たりの場代
  const costPer = rentCost/4

  for (let i = 0; i < people[0].length; i++) {
    points[0][i] *= rate // 清算点を円に換算
    if (people[0][i] == name) points[0][i] += costPer*3  // 場代を払った人が3人分の場代をもらう
    else points[0][i] -= costPer  // 払ってない人から場代を引く
  }
  return  points
}
