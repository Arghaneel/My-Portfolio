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
    const res = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!res.ok) {
      throw new Error(`LeetCode API failed with status ${res.status}`);
    }

    const data = await res.json();
    
    // Map recent submissions
    const submissions = (data.recentSubmissions || []).slice(0, 5).map((sub: any) => {
      const ts = parseInt(sub.timestamp);
      const diffMs = Date.now() - ts * 1000;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      let timeStr = "recently";
      if (diffMins < 60) {
        timeStr = `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
      } else if (diffHours < 24) {
        timeStr = `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
      } else {
        timeStr = `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
      }

      // Simple difficulty heuristic based on common problems, or fallback to Medium
      let difficulty: "Easy" | "Medium" | "Hard" = "Medium";
      const titleLower = sub.title.toLowerCase();
      if (
        titleLower.includes("two sum") ||
        titleLower.includes("palindrome") ||
        titleLower.includes("reverse") ||
        titleLower.includes("merge") ||
        titleLower.includes("common prefix") ||
        titleLower.includes("sqrt") ||
        titleLower.includes("unique character") ||
        titleLower.includes("remove") ||
        titleLower.includes("search insert")
      ) {
        difficulty = "Easy";
      } else if (
        titleLower.includes("median") ||
        titleLower.includes("regular expression") ||
        titleLower.includes("merge k sorted") ||
        titleLower.includes("largest rectangle") ||
        titleLower.includes("minimum window")
      ) {
        difficulty = "Hard";
      }

      const langKey = sub.lang.toLowerCase();
      let language = sub.lang;
      if (langKey.startsWith("python")) language = "Python";
      else if (langKey === "cpp") language = "C++";
      else if (langKey === "javascript") language = "JavaScript";
      else if (langKey === "typescript") language = "TypeScript";
      else if (langKey === "mysql" || langKey === "postgresql") language = "SQL";

      return {
        title: sub.title,
        status: sub.statusDisplay === "Accepted" ? "Accepted" : "Wrong Answer",
        difficulty,
        language,
        time: timeStr,
      };
    });

    return {
      totalSolved: data.totalSolved || 0,
      totalQuestions: data.totalQuestions || 4000,
      easySolved: data.easySolved || 0,
      totalEasy: data.totalEasy || 1000,
      mediumSolved: data.mediumSolved || 0,
      totalMedium: data.totalMedium || 2000,
      hardSolved: data.hardSolved || 0,
      totalHard: data.totalHard || 1000,
      ranking: data.ranking || mockLeetCodeStats.ranking,
      contestRating: mockLeetCodeStats.contestRating, // mock field
      streak: mockLeetCodeStats.streak, // mock field
      submissions,
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
