# 📊 GitHub Stats Generator

Générateur automatique de statistiques GitHub avec plusieurs variantes.

## 🎯 Résultat

Ce projet génère automatiquement des images SVG affichant vos langages les plus utilisés :

- `stats-top4.svg` - Top 4 langages
- `stats-top5.svg` - Top 5 langages
- `stats-top6.svg` - Top 6 langages
- `stats-top7.svg` - Top 7 langages
- `stats-top8.svg` - Top 8 langages
- `stats.svg` - Version par défaut (top 5)

## 🚀 Installation

### 1. Créer le repository

```bash
# Créer un nouveau dépôt sur GitHub
# Nom suggéré : github-stats

# Cloner et ajouter les fichiers
git clone https://github.com/votre-username/github-stats.git
cd github-stats
```

### 2. Ajouter les fichiers

Créez la structure suivante :

```
github-stats/
├── .github/
│   └── workflows/
│       └── update-stats.yml
├── generate-stats.js
└── README.md
```

### 3. Modifier le username

Dans `generate-stats.js`, ligne 4, remplacez :
```javascript
const USERNAME = 'votre-username'; // Mettez votre username GitHub
```

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
https://votre-username.github.io/github-stats/stats-top4.svg
https://votre-username.github.io/github-stats/stats-top5.svg
https://votre-username.github.io/github-stats/stats-top6.svg
https://votre-username.github.io/github-stats/stats-top7.svg
https://votre-username.github.io/github-stats/stats-top8.svg
https://votre-username.github.io/github-stats/stats.svg
```

### Dans un README :

```markdown
![Top 5 Languages](https://votre-username.github.io/github-stats/stats-top5.svg)
```

### En HTML :

```html
<img src="https://votre-username.github.io/github-stats/stats-top5.svg" alt="Top Languages">
```

## ⚙️ Configuration

### Changer la fréquence de mise à jour

Dans `.github/workflows/update-stats.yml`, modifiez la ligne cron :

```yaml
schedule:
  - cron: '0 0 * * *'  # Tous les jours à minuit
  - cron: '0 */6 * * *'  # Toutes les 6 heures
  - cron: '0 0 * * 1'  # Tous les lundis
```

### Personnaliser les couleurs

Dans `generate-stats.js`, modifiez l'objet `COLORS` :

```javascript
const COLORS = {
  background: '#0d1117',
  title: '#58a6ff',
  text: '#c9d1d9',
  subtext: '#8b949e',
  bar: '#0366d6'
};
```

### Ajouter d'autres variantes

Dans `generate-stats.js`, modifiez le tableau `variants` :

```javascript
const variants = [3, 4, 5, 10]; // Génèrera top3, top4, top5, top10
```

## 🐛 Dépannage

### L'action échoue

1. Vérifiez que le token `GH_TOKEN` est bien configuré
2. Vérifiez que le username dans `generate-stats.js` est correct
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

**Note :** Les statistiques sont mises à jour automatiquement chaque jour. Les repositories forkés sont exclus du calcul.