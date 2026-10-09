# usage-footer

入力欄の上に、使用量と残りを棒グラフで常時表示する Claude Code の mod です。

```
5h      ████░░░░░░░░ 67% left
7d      █░░░░░░░░░░░ 92% left
context ██░░░░░░░░░░ 85% left
used $0.10 this session
```

- 5時間枠・7日枠・コンテキストの3本と、このセッションの費用を出します。
- 棒の塗りつぶしが「使った分」です。70% 以上で黄色、90% 以上で赤になります。
- 各返答のあとに更新されます。
- 入力欄の上の表示は、ターミナルとデスクトップの画面で描かれます。

## インストール

手元のターミナルで `claude` を起動し、その中で実行します。

```
/plugin install usage-footer --marketplace roshi3219-maker/HM
```

`y` で marketplace を追加し、`Install for you (user scope)` を選びます。

## コマンド

- `/remaining`: 現在の残量を文章で表示します。
- `/pane`: 同じ棒グラフを Pane で開きます（Pane を描ける画面のみ）。
