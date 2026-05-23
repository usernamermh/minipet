# Sprite Themes

Renderer now supports configurable sprite themes via `pet.sprite_theme` in `config.json`.

Supported values:

- `cat_1`
- `cat_2`
- `cat_3`
- `cat_4`
- `cat_5`
- `cat_6`
- `tiny_cat`
- `blue_bird`

Notes:

- If `sprite_theme` is missing or invalid, the app falls back to `cat_1`.
- `tiny_cat` and `blue_bird` use frame-by-frame assets.
- The classic cat themes use sprite sheets from the existing cat pack.

Example:

```json
{
  "pet": {
    "sprite_theme": "tiny_cat"
  }
}
```
