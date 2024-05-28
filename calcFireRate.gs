function CALCFIRERATE(people, recodes) {

  // 結果シートから取得してきた配列には空白が含まれているので、それらを削除
  for (let i = 0; i< people[0].length; i++) people[0].splice(i+1, 1);
  // 名前が4人分記入されていなければ知らせる
  if (people[0].some(a => a === '')) return "名前を入力してください。"

  let counts = {};  // だれが何回放銃したかカウントした結果を保持する
  let hantyan = 0;  // 半荘数
  let fireRate = Array(4).fill(0);  // 放銃率

  // 誰が何回放銃したかカウント
  for (let i = 0; i < recodes.length; i++) {
    const item = recodes[i];
    if (item == '') break
    if (counts[item]) {
        counts[item]++;
    } else {
        counts[item] = 1;
    }
    hantyan++
  }

  // 放銃率を少数第２位まで計算
  for (let i = 0; i < Object.keys(counts).length; i++) {
    re = counts[people[0][i]] / hantyan
    fireRate[i] = parseFloat(re.toFixed(3))
  }

  return fireRate
}
