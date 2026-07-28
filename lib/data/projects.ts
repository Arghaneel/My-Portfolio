export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: "Web Development" | "AI/ML" | "IoT" | "Full Stack";
  techStack: string[];
  keyFeatures: string[];
  images: string[];
  liveDemoUrl?: string;
  githubUrl?: string;
}

export const projects: Project[] = [
  {
    slug: "jeevandhara",
    title: "Jeevandhara",
    tagline: "AI-Powered Agriculture Platform for Smart Farming",
    description:
      "Jeevandhara is an intelligent agricultural solution designed to help farmers detect crop diseases early, receive precise local weather predictions, and manage automated irrigation alerts. By leveraging computer vision and real-time sensor analytics, Jeevandhara significantly increases crop yield and reduces resource wastage.",
    category: "AI/ML",
    techStack: ["Python", "Flask", "MongoDB", "PyTorch", "Tailwind CSS"],
    keyFeatures: [
      "Real-time crop leaf disease detection using a custom CNN image classifier.",
      "Localized weather forecasting integration via OpenWeather API.",
      "Smart irrigation alerts based on soil moisture levels and heat index.",
      "Interactive farmer discussion forum with translation support.",
      "Simple, multilingual dashboard optimized for rural connectivity.",
    ],
    images: [
      "/images/jeevandhara_1.png",
      "/images/jeevandhara_2.png",
      "/images/jeevandhara_3.png",
    ],
    liveDemoUrl: "https://jeevandhara-smart-farm.vercel.app",
    githubUrl: "https://github.com/arghaneel-das/jeevandhara",
  },
  {
    slug: "sixthsense",
    title: "SixthSense",
    tagline: "IoT Wearable Device for the Visually Impaired",
    description:
      "SixthSense is an innovative IoT wearable device built to assist visually impaired individuals navigate their surroundings safely. Using ultrasonic sensors, haptic motors, and audio guidance, the device detects obstacles and calculates proximity to alert the user of impending danger.",
    category: "IoT",
    techStack: ["ESP32", "Arduino IDE", "C", "C++", "Bluetooth Low Energy"],
    keyFeatures: [
      "Proximity-based ultrasonic obstacle detection up to 4 meters away.",
      "Variable haptic feedback frequency depending on distance of obstacles.",
      "Real-time audio alert notifications broadcast via bone-conduction headphones.",
      "Emergency SOS button sending GPS location over GSM module.",
      "Ultra-low power optimization, ensuring over 12 hours of active battery life.",
    ],
    images: [
      "/images/sixthsense_1.png",
      "/images/sixthsense_2.png",
      "/images/sixthsense_3.png",
    ],
    liveDemoUrl: "https://github.com/arghaneel-das/sixthsense", // Fallback if no web demo for hardware
    githubUrl: "https://github.com/arghaneel-das/sixthsense",
  },
  {
    slug: "indian-folk-art-marketplace",
    title: "Indian Folk Art Marketplace",
    tagline: "Empowering Rural Artisans via Secure Digital Commerce",
    description:
      "A dedicated e-commerce platform that directly connects rural Indian artisans with global art collectors. The platform eliminates intermediaries, guarantees fair pricing, and showcases traditional folk art forms such as Madhubani, Warli, and Pattachitra with rich cultural stories.",
    category: "Web Development",
    techStack: ["Node.js", "Express.js", "MongoDB", "Vanilla JS", "CSS3"],
    keyFeatures: [
      "Direct artisan onboarding dashboard with simplified listing tools.",
      "Secure payment processing integration via Razorpay.",
      "Cultural storytelling panels detailing the origin and history of each art piece.",
      "Category and location filters allowing users to search by specific folk art forms.",
      "Fully responsive and lightweight UI, running smoothly on mobile connections.",
    ],
    images: [
      "/images/folkart_1.png",
      "/images/folkart_2.png",
      "/images/folkart_3.png",
    ],
    liveDemoUrl: "https://indian-folkart-marketplace.vercel.app",
    githubUrl: "https://github.com/arghaneel-das/indian-folk-art-marketplace",
  },
  {
    slug: "oscode-community-portal",
    title: "OSCode Community Portal",
    tagline: "Central Hub for Hackathons, Workshops, and Developer Leaderboards",
    description:
      "A complete community platform built for OSCode Atria. It aggregates student projects, registers attendees for upcoming tech meetups and workshops, and displays a gamified coding leaderboard to promote active open-source contribution.",
    category: "Full Stack",
    techStack: ["Next.js 15", "React 19", "MongoDB", "Tailwind CSS", "GitHub API"],
    keyFeatures: [
      "Dynamic dashboard pulling student GitHub repository statistics.",
      "Automated event registration system with customizable QR-code tickets.",
      "Gamified community leaderboard based on GitHub PR contributions and workshop attendance.",
      "Community project gallery with a built-in peer-upvote voting system.",
      "Integrated announcement feed with Discord webhook sync.",
    ],
    images: [
      "/images/oscode_1.png",
      "/images/oscode_2.png",
      "/images/oscode_3.png",
    ],
    liveDemoUrl: "https://oscode-atria.vercel.app",
    githubUrl: "https://github.com/arghaneel-das/oscode-portal",
  },
];
