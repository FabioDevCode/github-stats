const fs = require('fs');

// Configuration
const CONFIG = JSON.parse(fs.readFileSync('config.json', 'utf8'));;

// Couleurs officielles GitHub (NE PAS MODIFIER)
const LANGUAGE_COLORS = JSON.parse(fs.readFileSync('github_colors.json', 'utf8'));

// Icônes SVG pour les stats
const ICONS = {
	star: `<path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>`,
	commit: `<path fill-rule="evenodd" d="M11.93 8.5a4.002 4.002 0 01-7.86 0H.75a.75.75 0 010-1.5h3.32a4.002 4.002 0 017.86 0h3.32a.75.75 0 010 1.5h-3.32zm-1.43-.75a2.5 2.5 0 10-5 0 2.5 2.5 0 005 0z"/>`,
	pullRequest: `<path fill-rule="evenodd" d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"/>`,
	issue: `<path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/><path fill-rule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>`,
	contrib: `<path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>`,
	github: `<path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>`
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

async function fetchGitHubUserStats(username, token) {
	console.log(`📊 Récupération des stats utilisateur pour ${username}...`);

	const query = `
	query($username: String!) {
		user(login: $username) {
			repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
				totalCount
				nodes {
					stargazerCount
				}
			}
			pullRequests(first: 1) {
				totalCount
			}
			issues(first: 1) {
				totalCount
			}
			repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
				totalCount
			}
			contributionsCollection {
				totalCommitContributions
				restrictedContributionsCount
			}
		}
	}`;

	try {
		const response = await fetch('https://api.github.com/graphql', {
			method: 'POST',
			headers: {
				'Authorization': `bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ query, variables: { username } })
		});

		if (!response.ok) {
			throw new Error(`GitHub GraphQL API error: ${response.status}`);
		}

		const data = await response.json();
		
		if (data.errors) {
			throw new Error(data.errors[0].message);
		}

		const user = data.data.user;
		const totalStars = user.repositories.nodes.reduce((sum, repo) => sum + repo.stargazerCount, 0);
		const totalCommits = user.contributionsCollection.totalCommitContributions + user.contributionsCollection.restrictedContributionsCount;

		const stats = {
			stars: totalStars,
			commits: totalCommits,
			pullRequests: user.pullRequests.totalCount,
			issues: user.issues.totalCount,
			contributedTo: user.repositoriesContributedTo.totalCount
		};

		console.log(`✅ Stats utilisateur récupérées:`, stats);
		return stats;
	} catch (error) {
		console.error('❌ Erreur lors de la récupération des stats utilisateur:', error.message);
		throw error;
	}
}

function formatNumber(num) {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1) + 'M';
	} else if (num >= 1000) {
		return (num / 1000).toFixed(1) + 'k';
	}
	return num.toString();
}

function generateUserStatsSVG(stats, username) {
	const statItems = [
		{ label: 'Total Stars', value: stats.stars, icon: ICONS.star },
		{ label: 'Total Commits', value: stats.commits, icon: ICONS.commit },
		{ label: 'Total PRs', value: stats.pullRequests, icon: ICONS.pullRequest },
		{ label: 'Total Issues', value: stats.issues, icon: ICONS.issue },
		{ label: 'Contributed to', value: stats.contributedTo, icon: ICONS.contrib }
	];

	const statsTitle = CONFIG.STATS_TITLE || `${username}'s GitHub Stats`;
	const iconColor = CONFIG.ICON_COLOR || '#6e7681';
	const valueColor = CONFIG.VALUE_COLOR || CONFIG.TEXT_COLOR;

	let itemsY = 60;
	const statsItems = statItems.map(item => {
		const formattedValue = formatNumber(item.value);
		const itemSVG = `
		<g transform="translate(25, ${itemsY})">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="${iconColor}">
				${item.icon}
			</svg>
			<text x="28" y="12" font-size="14" fill="${CONFIG.TEXT_COLOR}">${item.label}:</text>
			<text x="145" y="12" font-size="14" font-weight="600" fill="${valueColor}">${formattedValue}</text>
		</g>`;
		itemsY += 24;
		return itemSVG;
	}).join('');

	const height = 195;
	const width = 420;

	return `<?xml version="1.0" encoding="UTF-8"?>
	<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
		<defs>
		<style>
			@import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;500;600&amp;display=swap');
			* { font-family: 'Segoe UI', Ubuntu, sans-serif; }
		</style>
		</defs>

		<!-- Background -->
		<rect width="${width}" height="${height}" fill="${CONFIG.BG_COLOR}" rx="10" stroke="${CONFIG.BORDER_COLOR}" stroke-width="1"/>

		<!-- Title -->
		<text x="25" y="35" font-size="18" fill="${CONFIG.TITLE_COLOR}" font-weight="600">
			${statsTitle}
		</text>

		<!-- Stats Items -->
		${statsItems}

		<!-- GitHub Logo -->
		<g transform="translate(${width - 100}, ${height / 2 - 40})">
			<svg width="80" height="80" viewBox="0 0 16 16" fill="${iconColor}" opacity="0.3">
				${ICONS.github}
			</svg>
		</g>
	</svg>`;
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
		<text x="15" y="30" font-size="18" fill="${CONFIG.TITLE_COLOR}" font-weight="600">
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
		const variants = CONFIG.VARIANTS || [2, 4, 6];

		console.log('\n📸 Génération des images SVG...');
		variants.forEach(n => {
			const svg = generateSVG(languageStats, n);
			const filename = `stats-top${n}.svg`;
			fs.writeFileSync(filename, svg);
			console.log(`  ✅ ${filename}`);
		});

		// Générer les stats utilisateur
		const userStats = await fetchGitHubUserStats(CONFIG.USERNAME, token);
		const userStatsSVG = generateUserStatsSVG(userStats, CONFIG.USERNAME);
		fs.writeFileSync('github-stats.svg', userStatsSVG);
		console.log(`  ✅ github-stats.svg`);

		console.log('\n🎉 Toutes les images ont été générées avec succès !');
	} catch (error) {
		console.error('❌ Erreur lors de la génération:', error);
		process.exit(1);
	}
}

main();