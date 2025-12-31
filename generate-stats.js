const fs = require('fs');

// Configuration
const USERNAME = 'FabioDevCode'; // À MODIFIER

// Couleurs officielles GitHub pour les langages
const LANGUAGE_COLORS = {
  'JavaScript': '#f1e05a',
  'TypeScript': '#3178c6',
  'Python': '#3572A5',
  'Java': '#b07219',
  'C': '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  'PHP': '#4F5D95',
  'Ruby': '#701516',
  'Go': '#00ADD8',
  'Rust': '#dea584',
  'Swift': '#F05138',
  'Kotlin': '#A97BFF',
  'Dart': '#00B4AB',
  'Scala': '#c22d40',
  'Shell': '#89e051',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'Vue': '#41b883',
  'Svelte': '#ff3e00',
  'Lua': '#000080',
  'R': '#198CE7',
  'Objective-C': '#438eff',
  'Perl': '#0298c3',
  'Haskell': '#5e5086',
  'Elixir': '#6e4a7e',
  'Clojure': '#db5855',
  'Groovy': '#4298b8',
  'Julia': '#a270ba',
  'MATLAB': '#e16737',
  'Assembly': '#6E4C13',
  'Vim Script': '#199f4b',
  'Dockerfile': '#384d54',
  'Makefile': '#427819',
};

async function fetchGitHubStats(username, token) {
  console.log(`📊 Récupération des stats pour ${username}...`);

  const headers = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json'
  };

  try {
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&type=owner`,
      { headers }
    );

    if (!reposResponse.ok) {
      throw new Error(`GitHub API error: ${reposResponse.status}`);
    }

    const repos = await reposResponse.json();
    console.log(`✅ ${repos.length} repositories trouvés`);

    // Compter les lignes de code par langage
    const languageStats = {};

    for (const repo of repos) {
      if (!repo.fork && repo.language) {
        const langResponse = await fetch(repo.languages_url, { headers });
        const languages = await langResponse.json();

        for (const [lang, bytes] of Object.entries(languages)) {
          languageStats[lang] = (languageStats[lang] || 0) + bytes;
        }
      }
    }

    console.log(`📝 ${Object.keys(languageStats).length} langages différents détectés`);
    return languageStats;

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    throw error;
  }
}

function getLanguageColor(language) {
  return LANGUAGE_COLORS[language] || '#858585';
}

function generateSVG(languageStats, topN = 5) {
  // Trier et limiter
  const sortedLangs = Object.entries(languageStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);

  if (sortedLangs.length === 0) {
    return generateEmptySVG(topN);
  }

  const totalBytes = sortedLangs.reduce((sum, [, bytes]) => sum + bytes, 0);

  // Calculer les pourcentages
  const langData = sortedLangs.map(([lang, bytes]) => ({
    name: lang,
    bytes: bytes,
    percentage: (bytes / totalBytes * 100).toFixed(1),
    color: getLanguageColor(lang)
  }));

  // Générer la barre de progression
  let currentX = 0;
  const barHeight = 12;
  const barY = 50;
  const barSegments = langData.map(lang => {
    const width = (lang.percentage / 100) * 400;
    const segment = `<rect x="${currentX}" y="${barY}" width="${width}" height="${barHeight}" fill="${lang.color}"/>`;
    currentX += width;
    return segment;
  }).join('');

  // Générer la légende
  let legendY = 85;
  const legendItems = langData.map(lang => {
    const item = `
      <g>
        <circle cx="20" cy="${legendY}" r="5" fill="${lang.color}"/>
        <text x="35" y="${legendY + 4}" font-size="14" fill="#c9d1d9">${lang.name}</text>
        <text x="380" y="${legendY + 4}" font-size="14" fill="#8b949e" text-anchor="end">${lang.percentage}%</text>
      </g>
    `;
    legendY += 25;
    return item;
  }).join('');

  const height = 70 + (topN * 25) + 20;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="420" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;500;600&amp;display=swap');
      * { font-family: 'Segoe UI', Ubuntu, sans-serif; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="420" height="${height}" fill="#0d1117" rx="10" stroke="#30363d" stroke-width="1"/>

  <!-- Title -->
  <text x="210" y="30" font-size="18" fill="#58a6ff" font-weight="600" text-anchor="middle">
    Top Languages
  </text>

  <!-- Progress Bar Container -->
  <rect x="10" y="${barY}" width="400" height="${barHeight}" fill="#161b22" rx="6"/>

  <!-- Progress Bar Segments -->
  ${barSegments}

  <!-- Legend -->
  ${legendItems}
</svg>`;
}

function generateEmptySVG(topN) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="420" height="150" xmlns="http://www.w3.org/2000/svg">
  <rect width="420" height="150" fill="#0d1117" rx="10"/>
  <text x="210" y="75" font-size="16" fill="#8b949e" text-anchor="middle">
    Aucune donnée disponible
  </text>
</svg>`;
}

async function main() {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.error('❌ GITHUB_TOKEN non défini !');
    process.exit(1);
  }

  try {
    const languageStats = await fetchGitHubStats(USERNAME, token);

    // Générer plusieurs versions
    const variants = [4, 5, 6, 7, 8];

    console.log('\n📸 Génération des images SVG...');
    variants.forEach(n => {
      const svg = generateSVG(languageStats, n);
      const filename = `stats-top${n}.svg`;
      fs.writeFileSync(filename, svg);
      console.log(`  ✅ ${filename}`);
    });

    // Générer aussi une version "default" (top 5)
    const defaultSvg = generateSVG(languageStats, 5);
    fs.writeFileSync('stats.svg', defaultSvg);
    console.log('  ✅ stats.svg (default)');

    console.log('\n🎉 Toutes les images ont été générées avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error);
    process.exit(1);
  }
}

main();