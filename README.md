# GitHub Stats Generator

[FR - README en Français](README.fr.md)

Automatically generate SVG cards for your GitHub stats and embed them in any README.

This project runs entirely with **GitHub Actions**: no local installation required. Images are generated on a schedule you control and hosted on **GitHub Pages**, with public URLs.

## 🎯 Output

This project generates SVG images showing your GitHub statistics and most used languages.

- `stats-top4.svg` - Top 4 languages
- `github-stats.svg` - Global GitHub stats

### Examples

<div style="display: inline-block" align="left">
  <img height="180px" src="https://fabiodevcode.github.io/github-stats/stats-top4.svg"/>
  <img height="180px" src="https://fabiodevcode.github.io/github-stats/github-stats.svg"/>
</div>

## 🚀 Installation

### 1. Clone the repository

```bash
# Clone the project
git clone https://github.com/FabioDevCode/github-stats.git
cd github-stats

# Remove existing SVG files (they will be regenerated with your stats)
rm -f *.svg
```

### 2. Verify the project structure

After cloning, make sure the following structure is present:

```
github-stats/
├── .github/
│   └── workflows/
│       └── update-stats.yml
├── config.json
├── generate-stats.js
├── github_colors.json
├── README.md
└── README.fr.md
```

### 3. Update configuration

In `config.json`, update values to match your needs:

```json
{
  "USERNAME": "your-username",
  "TITLE": "Top Languages",
  "STATS_TITLE": "GitHub Stats",
  "BG_COLOR": "#202830",
  "BORDER_COLOR": "#202830",
  "TITLE_COLOR": "#D1D7E0",
  "TEXT_COLOR": "#D1D7E0",
  "PERCENT_COLOR": "#9298A1",
  "ICON_COLOR": "#6e7681",
  "VALUE_COLOR": "#41B883",
  "VARIANTS": [2, 4, 6],
  "IGNORE_LANGUAGES": ["HTML", "CSS", "Handlebars", "SCSS"]
}
```

> 📝 **Note:** See the [Available options](#available-options) section for full parameter details.

### 4. Create a GitHub token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name: `GitHub Stats`
4. Select these permissions:

- ✅ `repo` (all sub-items)
- ✅ `read:user`

5. Generate and **copy the token** (you will not see it again)

### 5. Add token to repository secrets

1. In your GitHub repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `GH_TOKEN`
4. Secret: paste your token
5. Click "Add secret"

### 6. Enable GitHub Pages

1. Repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` / `/ (root)`
4. Click "Save"

### 7. First run

Two options:

**Option A - Automatic:**

```bash
git add .
git commit -m "Initial setup"
git push
```

**Option B - Manual:**

1. Open the "Actions" tab in your repository
2. Select the "Update GitHub Stats" workflow
3. Click "Run workflow"

## 📝 Usage

After deployment, your images are available at:

```
https://your-username.github.io/github-stats/stats-top2.svg
https://your-username.github.io/github-stats/stats-top4.svg
https://your-username.github.io/github-stats/stats-top6.svg
https://your-username.github.io/github-stats/github-stats.svg
```

> **Note:** `stats-topN.svg` files depend on the `VARIANTS` setting in `config.json`. `github-stats.svg` contains your global stats (stars, commits, PRs, issues, contributions).

### In a README

```markdown
![Top Languages](https://your-username.github.io/github-stats/stats-top4.svg)
![GitHub Stats](https://your-username.github.io/github-stats/github-stats.svg)
```

### In HTML

```html
<img
  src="https://your-username.github.io/github-stats/stats-top4.svg"
  alt="Top Languages"
/>
<img
  src="https://your-username.github.io/github-stats/github-stats.svg"
  alt="GitHub Stats"
/>
```

## ⚙️ Configuration

All settings are configured in `config.json`:

```json
{
  "USERNAME": "your-username",
  "TITLE": "Top Languages",
  "STATS_TITLE": "GitHub Stats",
  "BG_COLOR": "#202830",
  "BORDER_COLOR": "#202830",
  "TITLE_COLOR": "#D1D7E0",
  "TEXT_COLOR": "#D1D7E0",
  "PERCENT_COLOR": "#9298A1",
  "ICON_COLOR": "#6e7681",
  "VALUE_COLOR": "#41B883",
  "VARIANTS": [2, 4, 6],
  "IGNORE_LANGUAGES": ["HTML", "CSS", "Handlebars", "SCSS"]
}
```

### Available options

| Option             | Description                     | Exemple           |
| ------------------ | ------------------------------- | ----------------- |
| `USERNAME`         | Your GitHub username            | `"FabioDevCode"`  |
| `TITLE`            | Title shown on languages SVG    | `"Top Languages"` |
| `STATS_TITLE`      | Title shown on global stats SVG | `"GitHub Stats"`  |
| `BG_COLOR`         | Background color                | `"#202830"`       |
| `BORDER_COLOR`     | Border color                    | `"#202830"`       |
| `TITLE_COLOR`      | Title color                     | `"#D1D7E0"`       |
| `TEXT_COLOR`       | Text color                      | `"#D1D7E0"`       |
| `PERCENT_COLOR`    | Percentage color (languages)    | `"#9298A1"`       |
| `ICON_COLOR`       | Icon color (global stats)       | `"#6e7681"`       |
| `VALUE_COLOR`      | Value color (global stats)      | `"#41B883"`       |
| `VARIANTS`         | Variants to generate (top N)    | `[2, 4, 6, 8]`    |
| `IGNORE_LANGUAGES` | Languages excluded from stats   | `["HTML", "CSS"]` |

### Change update frequency

In `.github/workflows/update-stats.yml`, set the `cron` value to match your preferred schedule:

```yaml
schedule:
  - cron: "0 0 * * *" # Every day at midnight
  - cron: "0 */6 * * *" # Every 6 hours
  - cron: "0 0 * * 1" # Every Monday
```

> 💡 The default schedule is defined in this file. Keep only one active `- cron:` line.

### Language colors

Language colors are defined in `github_colors.json`. This file contains official GitHub language colors and can be customized if needed.

## 🐛 Troubleshooting

### Workflow fails

1. Check that the `GH_TOKEN` secret is correctly configured
2. Check that `USERNAME` in `config.json` is correct
3. Review logs in the "Actions" tab

### Images are not displayed

1. Wait 2–3 minutes after the first push (GitHub Pages deployment)
2. Confirm GitHub Pages is enabled in repository settings
3. Check URL format: `https://your-username.github.io/repo-name/stats-top4.svg`

### Force a manual update

1. Open the "Actions" tab
2. Select "Update GitHub Stats"
3. Click "Run workflow"

## 📄 License

This project is distributed under the [MIT](LICENSE) license. You are free to use, modify, and redistribute it.

---

**Note:** Forked repositories are excluded from stats calculation. Update frequency is configurable in [Change update frequency](#change-update-frequency).
