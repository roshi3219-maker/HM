# usage-footer

A Claude Code mod that shows your remaining usage in a pane: the 5-hour and 7-day limits, the context window, and what the session has cost. It updates after every reply.

## Install

```
/plugin install usage-footer --marketplace roshi3219-maker/hm
```

## Use

- The `Usage` pane shows a bar for each limit and the session cost, and opens by itself at session start. Its position is chosen by the app. Where the surface draws the band above the prompt (terminal, desktop), the same bars show there too.
- `/pane` opens it again after you close it.
- `/remaining` prints the current figures as text.

The limits show only where the account reports them; otherwise the pane says `usage: no rate-limit data`.
