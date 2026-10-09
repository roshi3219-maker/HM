# usage-footer

A Claude Code mod that shows your remaining usage in a pane: the 5-hour and 7-day limits, the context window, and what the session has cost. It updates after every reply.

## Install

```
/plugin install usage-footer --marketplace roshi3219-maker/hm
```

## Use

- The `Usage` pane opens by itself when the session starts. Its position is chosen by the app.
- `/pane` opens it again after you close it.
- `/remaining` prints the current figures as text.

The limits show only where the account reports them; otherwise the pane says `usage: no rate-limit data`.
