function RENTCOST(points, rate, nameAndCost) {

  // "結果"のシートを取得
  const majanSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  const resultSheet = majanSpreadsheet.getSheetByName('結果')
  const recordSheet = majanSpreadsheet.getSheetByName('成績')
  // 名前とレートを途中で変えたくなったら、関数内で取ってこないで、引数に渡すようにする。
  // 名前を取得
  const people = recordSheet.getRange('B1:E1').getValues()[0]
  // レートを取得
  // const rate = resultSheet.getRange('M2').getValue()

  // 取得してくるまでに時間がかかるっぽく、取得前にアクセスしようとするとエラーになるので、取得されるまで待つ
  if (points[0].length != 8 || nameAndCost.length != 2 || people.length != 4) Utilities.sleep(100)

  // 場代と債務者を代入
  const rentCost = nameAndCost[0]
  const name = nameAndCost[1]

  // 債務者が空欄の場合、清算点をそのまま返す
  if (name == '') {
    return points
  }

  // 一人当たりの場代
  const costPer = rentCost/4

  for (let i = 0; i < people.length; i++) {
    points[0][i] *= rate // 円に換算
    if (people[i] == name) points[0][i] += costPer*3  // 場代を払った人が3人分の場代をもらう
    else points[0][i] -= costPer  // 払ってない人から場代を引く
  }
  return  points
}
