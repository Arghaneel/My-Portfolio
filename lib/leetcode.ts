export interface LeetCodeStats {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  ranking: number;
  contestRating: number;
  streak: number;
  submissions: Array<{
    title: string;
    status: "Accepted" | "Wrong Answer" | "Time Limit Exceeded";
    difficulty: "Easy" | "Medium" | "Hard";
    language: string;
    time: string;
  }>;
  submissionCalendar: Record<string, number>;
  stale?: boolean;
}

const mockLeetCodeStats: LeetCodeStats = {
  totalSolved: 243,
  totalQuestions: 3100,
  easySolved: 120,
  totalEasy: 800,
  mediumSolved: 105,
  totalMedium: 1600,
  hardSolved: 18,
  totalHard: 700,
  ranking: 154032,
  contestRating: 1684,
  streak: 14,
  submissions: [
    {
      title: "Longest Palindromic Substring",
      status: "Accepted",
      difficulty: "Medium",
      language: "Python",
      time: "2 hours ago",
    },
    {
      title: "Two Sum",
      status: "Accepted",
      difficulty: "Easy",
      language: "C++",
      time: "1 day ago",
    },
    {
      title: "Merge k Sorted Lists",
      status: "Accepted",
      difficulty: "Hard",
      language: "Python",
      time: "3 days ago",
    },
    {
      title: "Container With Most Water",
      status: "Wrong Answer",
      difficulty: "Medium",
      language: "JavaScript",
      time: "4 days ago",
    },
    {
      title: "Binary Tree Inorder Traversal",
      status: "Accepted",
      difficulty: "Easy",
      language: "Python",
      time: "5 days ago",
    },
  ],
  submissionCalendar: {}, // Generated dynamically in fetch
};

// Generate calendar mock timestamps for the last 6 months (approx 180 days)
const generateMockCalendar = () => {
  const cal: Record<string, number> = {};
  const now = Math.floor(Date.now() / 1000);
  const dayInSeconds = 24 * 60 * 60;
  for (let i = 0; i < 180; i++) {
    const timestamp = now - i * dayInSeconds;
    if ((i * 11) % 100 < 45) {
      cal[timestamp.toString()] = ((i * 3) % 4) + 1;
    }
  }
  return cal;
};

mockLeetCodeStats.submissionCalendar = generateMockCalendar();

export async function fetchLeetCodeStats(username: string): Promise<LeetCodeStats> {
  try {
    const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!res.ok) {
      throw new Error(`LeetCode API failed with status ${res.status}`);
    }

    const data = await res.json();
    if (data.status !== "success") {
      throw new Error(data.message || "LeetCode stats fetch failed");
    }

    // Merge live data with mock details (for things like contest rating and submissions list)
    return {
      totalSolved: data.totalSolved,
      totalQuestions: data.totalQuestions,
      easySolved: data.easySolved,
      totalEasy: data.totalEasy,
      mediumSolved: data.mediumSolved,
      totalMedium: data.totalMedium,
      hardSolved: data.hardSolved,
      totalHard: data.totalHard,
      ranking: data.ranking || mockLeetCodeStats.ranking,
      contestRating: mockLeetCodeStats.contestRating, // mock field
      streak: mockLeetCodeStats.streak, // mock field
      submissions: mockLeetCodeStats.submissions, // mock field
      submissionCalendar: data.submissionCalendar && Object.keys(data.submissionCalendar).length > 0
        ? data.submissionCalendar
        : mockLeetCodeStats.submissionCalendar,
    };
  } catch (error) {
    console.error("Error fetching live LeetCode stats:", error);
    return {
      ...mockLeetCodeStats,
      stale: true,
    };
  }
}
