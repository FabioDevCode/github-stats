const fs = require('fs');

// Configuration
const CONFIG = JSON.parse(fs.readFileSync('config.json', 'utf8'));;

// Couleurs officielles GitHub (NE PAS MODIFIER)
const LANGUAGE_COLORS = JSON.parse(fs.readFileSync('github_colors.json', 'utf8'));

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
	let currentX = 10;
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
			<text x="35" y="${legendY + 4}" font-size="14" fill="${CONFIG.TEXT_COLOR}">${lang.name}</text>
			<text x="380" y="${legendY + 4}" font-size="14" fill="${CONFIG.PERCENT_COLOR}" text-anchor="end">${lang.percentage}%</text>
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
		<rect width="420" height="${height}" fill="${CONFIG.BG_COLOR}" rx="10" stroke="${CONFIG.BORDER_COLOR}" stroke-width="1"/>

		<!-- Title -->
		<text x="210" y="30" font-size="18" fill="${CONFIG.TITLE_COLOR}" font-weight="600" text-anchor="middle">
			${CONFIG.TITLE}
		</text>

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
		let languageStats = await fetchGitHubStats(CONFIG.USERNAME, token);

		// Filtrer les langages ignorés
		if (CONFIG.IGNORE_LANGUAGES && CONFIG.IGNORE_LANGUAGES.length > 0) {
			languageStats = Object.fromEntries(
				Object.entries(languageStats).filter(([lang]) => !CONFIG.IGNORE_LANGUAGES.includes(lang))
			);
			console.log(`🚫 Langages ignorés: ${CONFIG.IGNORE_LANGUAGES.join(', ')}`);
		}

		// Générer plusieurs versions
		const variants = CONFIG.VARIANTS || [2, 4, 6, 8, 10];

		console.log('\n📸 Génération des images SVG...');
		variants.forEach(n => {
			const svg = generateSVG(languageStats, n);
			const filename = `stats-top${n}.svg`;
			fs.writeFileSync(filename, svg);
			console.log(`  ✅ ${filename}`);
		});

		console.log('\n🎉 Toutes les images ont été générées avec succès !');
	} catch (error) {
		console.error('❌ Erreur lors de la génération:', error);
		process.exit(1);
	}
}

main();