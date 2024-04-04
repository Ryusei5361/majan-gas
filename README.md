# majan-gas
スプレッドシートに最終的な点数を４人分入力すると、順位点等を計算し、精算結果を別のシートに出力するプログラムとなっています。
左が４人分の点数と風を入力するシートで、右が計算結果を出力するシートです。

<img src="https://github.com/Ryusei5361/majan-gas/assets/78830588/85849365-5278-4b1c-9789-0e732e2edc0b" width="51%"> <img src="https://github.com/Ryusei5361/majan-gas/assets/78830588/9ec47b04-342f-438b-a36d-f1db5875d9a1" width="48%">


# 仕様
- 使用する場合、スプレッドシートのコピーを作成し、ファイル名を日付にする。
- 30半荘分の結果を記入することができる。
- 各半荘ごとに、1つでも点数が入力されていなければ結果のシートにその半荘の結果は何も出力されない。
- 同順位がいた場合、起家に近い方を高順位とする。
- 風が入力されていない、かぶっている、など正しく入力されていなくても基本出力されるが、同順位がいる場合に限り、風を正しく入力しないと結果が出力されない。
  - エラーに応じた文が出力される
