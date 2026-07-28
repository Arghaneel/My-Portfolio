interface GithubRepo {
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
  updated_at: string;
}

export interface GithubStats {
  profile: {
    avatarUrl: string;
    name: string;
    bio: string;
    reposCount: number;
    followers: number;
    following: number;
    githubUrl: string;
  };
  repos: Array<{
    name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    url: string;
    updatedAt: string;
  }>;
  languages: Array<{
    name: string;
    percentage: number;
  }>;
  contributions: {
    total: number;
    calendar: Array<{
      date: string;
      count: number;
      level: 0 | 1 | 2 | 3 | 4;
    }>;
  };
  stale?: boolean;
}

// Custom Mock Data for Fallback
const mockGithubStats: GithubStats = {
  profile: {
    avatarUrl: "/images/profile.png",
    name: "Arghaneel Das",
    bio: "Computer Science Student & President of OSCode Atria. IoT, Web Development & AI enthusiast.",
    reposCount: 24,
    followers: 142,
    following: 98,
    githubUrl: "https://github.com/arghaneel-das",
  },
  repos: [
    {
      name: "jeevandhara",
      description: "AI-Powered Agriculture Platform for Crop Disease Scanning",
      stars: 12,
      forks: 3,
      language: "Python",
      url: "https://github.com/arghaneel-das/jeevandhara",
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      name: "sixthsense",
      description: "IoT Wearable Device for the Visually Impaired Navigation Assistive tech",
      stars: 8,
      forks: 2,
      language: "C++",
      url: "https://github.com/arghaneel-das/sixthsense",
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      name: "indian-folk-art-marketplace",
      description: "Digital commerce platform directly connecting rural artists with global buyers",
      stars: 15,
      forks: 4,
      language: "JavaScript",
      url: "https://github.com/arghaneel-das/indian-folk-art-marketplace",
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      name: "oscode-portal",
      description: "Web community system built for hackathons, workshops, and coding meetups",
      stars: 10,
      forks: 1,
      language: "TypeScript",
      url: "https://github.com/arghaneel-das/oscode-portal",
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  languages: [
    { name: "Python", percentage: 40 },
    { name: "JavaScript", percentage: 25 },
    { name: "TypeScript", percentage: 20 },
    { name: "C++", percentage: 10 },
    { name: "HTML/CSS", percentage: 5 },
  ],
  contributions: {
    total: 352,
    // Generate a list of days for the last 6 months (approx 180 days)
    calendar: Array.from({ length: 180 }).map((_, idx) => {
      const date = new Date();
      date.setDate(date.getDate() - idx);
      // Deterministic pseudo-random contribution levels
      const seed = (idx * 17) % 100;
      const count = seed < 40 ? 0 : seed < 70 ? 1 : seed < 85 ? 2 : seed < 95 ? 3 : 5;
      const level: 0 | 1 | 2 | 3 | 4 = count === 0 ? 0 : count === 1 ? 1 : count <= 2 ? 2 : count <= 3 ? 3 : 4;
      return {
        date: date.toISOString().split("T")[0],
        count,
        level,
      };
    }).reverse(),
  },
};

export async function fetchGithubStats(username: string): Promise<GithubStats> {
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    ...(token && { Authorization: `token ${token}` }),
  };

  try {
    // 1. Fetch Profile
    const profileRes = await fetch(`https://api.github.com/users/${username}`, {
      headers,
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!profileRes.ok) {
      throw new Error(`GitHub profile fetch failed: ${profileRes.statusText}`);
    }
    const profileData = await profileRes.json();

    // 2. Fetch Repos
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`, {
      headers,
      next: { revalidate: 1800 },
    });

    let reposList: GithubRepo[] = [];
    if (reposRes.ok) {
      reposList = await reposRes.json();
    }

    // 3. Process Languages
    const languageCounts: Record<string, number> = {};
    let totalLanguageSize = 0;

    reposList.forEach((repo) => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
        totalLanguageSize++;
      }
    });

    const processedLanguages = Object.entries(languageCounts)
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / (totalLanguageSize || 1)) * 100),
      }))
      .sort((a, b) => b.percentage - a.percentage);

    const formattedRepos = reposList
      .slice(0, 6)
      .map((repo) => ({
        name: repo.name,
        description: repo.description || "",
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || "Unknown",
        url: repo.html_url,
        updatedAt: repo.updated_at,
      }));

    // 4. Fetch GraphQL Contributions if token is available
    let contributionsTotal = 0;
    let contributionsCalendar: GithubStats["contributions"]["calendar"] = [];

    if (token) {
      const gqlQuery = {
        query: `
          query($username: String!) {
            user(login: $username) {
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                    }
                  }
                }
              }
            }
          }
        `,
        variables: { username },
      };

      const gqlRes = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gqlQuery),
        next: { revalidate: 1800 },
      });

      if (gqlRes.ok) {
        const gqlData = await gqlRes.json();
        const calData = gqlData?.data?.user?.contributionsCollection?.contributionCalendar;
        if (calData) {
          contributionsTotal = calData.totalContributions;
          
          const days: Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }> = [];
          calData.weeks.forEach((week: any) => {
            week.contributionDays.forEach((day: any) => {
              const count = day.contributionCount;
              const level = count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : count <= 5 ? 3 : 4;
              days.push({
                date: day.date,
                count,
                level,
              });
            });
          });
          contributionsCalendar = days;
        }
      }
    }

    // Fallback contribution generation if token isn't present or GraphQL fails
    if (contributionsCalendar.length === 0) {
      contributionsTotal = mockGithubStats.contributions.total;
      contributionsCalendar = mockGithubStats.contributions.calendar;
    }

    return {
      profile: {
        avatarUrl: profileData.avatar_url,
        name: profileData.name || profileData.login,
        bio: profileData.bio || "No bio description set.",
        reposCount: profileData.public_repos,
        followers: profileData.followers,
        following: profileData.following,
        githubUrl: profileData.html_url,
      },
      repos: formattedRepos.length > 0 ? formattedRepos : mockGithubStats.repos,
      languages: processedLanguages.length > 0 ? processedLanguages : mockGithubStats.languages,
      contributions: {
        total: contributionsTotal,
        calendar: contributionsCalendar,
      },
    };
  } catch (error) {
    console.error("Error fetching live GitHub stats:", error);
    // Return mock fallback on error, flagging it as stale
    return {
      ...mockGithubStats,
      stale: true,
    };
  }
}
