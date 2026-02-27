# GitHub Stats Generator

Générateur automatique de statistiques GitHub avec plusieurs variantes.

## 🎯 Résultat

Ce projet génère automatiquement des images SVG affichant, vos statistiques github et langages les plus utilisés.

- `stats-top4.svg` - Top 4 langages
- `github-stats.svg` - Statistiques globale github

### Exemples :

<div style="display: inline-block" align="left">
  <img height="180px" src="https://fabiodevcode.github.io/github-stats/stats-top4.svg"/>
  <img height="180px" src="https://fabiodevcode.github.io/github-stats/github-stats.svg"/>
</div>

## 🚀 Installation

### 1. Cloner le repository

```bash
# Cloner le projet
git clone https://github.com/FabioDevCode/github-stats.git
cd github-stats

# Supprimer les fichiers SVG existants (ils seront regénérés avec vos stats)
rm -f *.svg
```

### 2. Ajouter les fichiers

Créez la structure suivante :

```
github-stats/
├── .github/
│   └── workflows/
│       └── update-stats.yml
├── config.json
├── generate-stats.js
├── github_colors.json
└── README.md
```

### 3. Modifier la configuration

Dans `config.json`, modifiez les valeurs selon vos besoins :

```json
{
  "USERNAME": "votre-username",
  "TITLE": "Langages Utilisés",
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

> 📝 **Note :** Consultez la section [Options disponibles](#options-disponibles) pour la description complète de chaque paramètre.

### 4. Créer un token GitHub

1. Allez sur GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Cliquez sur "Generate new token (classic)"
3. Nom : `GitHub Stats`
4. Cochez les permissions :
   - ✅ `repo` (tous les sous-items)
   - ✅ `read:user`
5. Générez et **copiez le token** (vous ne le reverrez plus !)

### 5. Ajouter le token au repository

1. Dans votre repo GitHub → Settings → Secrets and variables → Actions
2. Cliquez sur "New repository secret"
3. Name : `GH_TOKEN`
4. Secret : collez votre token
5. Cliquez sur "Add secret"

### 6. Activer GitHub Pages

1. Repository Settings → Pages
2. Source : Deploy from a branch
3. Branch : `main` / `/ (root)`
4. Cliquez sur "Save"

### 7. Premier lancement

Deux options :

**Option A - Automatique :**

```bash
git add .
git commit -m "Initial setup"
git push
```

**Option B - Manuel :**

1. Allez dans l'onglet "Actions" de votre repo
2. Cliquez sur le workflow "Update GitHub Stats"
3. Cliquez sur "Run workflow"

## 📝 Utilisation

Une fois déployé, vos images seront disponibles aux URLs :

```
https://votre-username.github.io/github-stats/stats-top2.svg
https://votre-username.github.io/github-stats/stats-top4.svg
https://votre-username.github.io/github-stats/stats-top6.svg
https://votre-username.github.io/github-stats/github-stats.svg
```

> **Note :** Les fichiers `stats-topN.svg` dépendent de la configuration `VARIANTS` dans `config.json`. Le fichier `github-stats.svg` affiche vos statistiques globales (stars, commits, PRs, issues, contributions).

### Dans un README :

```markdown
![Top Languages](https://votre-username.github.io/github-stats/stats-top4.svg)
![Top Languages](https://votre-username.github.io/github-stats/github-stats.svg)
```

### En HTML :

```html
<img
  src="https://votre-username.github.io/github-stats/stats-top4.svg"
  alt="Top Languages"
/>
<img
  src="https://votre-username.github.io/github-stats/github-stats.svg"
  alt="Github Stats"
/>
```

## ⚙️ Configuration

Toute la configuration se fait dans le fichier `config.json` :

```json
{
  "USERNAME": "votre-username",
  "TITLE": "Langages Utilisés",
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

### Options disponibles

| Option             | Description                          | Exemple               |
| ------------------ | ------------------------------------ | --------------------- |
| `USERNAME`         | Votre nom d'utilisateur GitHub       | `"FabioDevCode"`      |
| `TITLE`            | Titre du SVG des langages            | `"Langages Utilisés"` |
| `STATS_TITLE`      | Titre du SVG des stats globales      | `"GitHub Stats"`      |
| `BG_COLOR`         | Couleur de fond                      | `"#202830"`           |
| `BORDER_COLOR`     | Couleur de la bordure                | `"#202830"`           |
| `TITLE_COLOR`      | Couleur du titre                     | `"#D1D7E0"`           |
| `TEXT_COLOR`       | Couleur du texte                     | `"#D1D7E0"`           |
| `PERCENT_COLOR`    | Couleur des pourcentages (langages)  | `"#9298A1"`           |
| `ICON_COLOR`       | Couleur des icônes (stats globales)  | `"#6e7681"`           |
| `VALUE_COLOR`      | Couleur des valeurs (stats globales) | `"#41B883"`           |
| `VARIANTS`         | Variantes à générer (top N langages) | `[2, 4, 6, 8]`        |
| `IGNORE_LANGUAGES` | Langages à exclure des stats         | `["HTML", "CSS"]`     |

### Changer la fréquence de mise à jour

Dans `.github/workflows/update-stats.yml`, modifiez la ligne cron :

```yaml
schedule:
  - cron: "0 0 * * *" # Tous les jours à minuit
  - cron: "0 */6 * * *" # Toutes les 6 heures
  - cron: "0 0 * * 1" # Tous les lundis
```

### Couleurs des langages

Les couleurs des langages sont définies dans `github_colors.json`. Ce fichier contient les couleurs officielles GitHub pour chaque langage. Vous pouvez le modifier si nécessaire.

## 🐛 Dépannage

### L'action échoue

1. Vérifiez que le token `GH_TOKEN` est bien configuré
2. Vérifiez que le `USERNAME` dans `config.json` est correct
3. Consultez les logs dans l'onglet "Actions"

### Les images ne s'affichent pas

1. Attendez 2-3 minutes après le premier push (déploiement GitHub Pages)
2. Vérifiez que GitHub Pages est activé dans Settings
3. Vérifiez l'URL : `https://votre-username.github.io/nom-du-repo/stats.svg`

### Forcer une mise à jour manuelle

1. Onglet "Actions"
2. "Update GitHub Stats"
3. "Run workflow"

## 📄 Licence

Ce projet est libre d'utilisation pour votre usage personnel.

---

**Note :** Les statistiques sont mises à jour automatiquement chaque Lundi. Les repositories forkés sont exclus du calcul.
