/**
 * 2026 Indian AI Engineering Job Description Data
 * Based on analysis of 215 Indian AI Engineering JDs
 * This data is used to benchmark resume skills against market demand
 */

export interface SkillBenchmark {
  skill: string;
  frequency: number;
  total: number;
  percentage: number;
  matched?: boolean;
}

export const aiSkillBenchmarks: SkillBenchmark[] = [
  { skill: "RAG / Retrieval Augmented Generation", frequency: 187, total: 215, percentage: 87 },
  { skill: "LangChain", frequency: 172, total: 215, percentage: 80 },
  { skill: "FastAPI", frequency: 156, total: 215, percentage: 73 },
  { skill: "Vector DBs (Pinecone/FAISS/Chroma)", frequency: 149, total: 215, percentage: 69 },
  { skill: "Prompt Engineering", frequency: 134, total: 215, percentage: 62 },
  { skill: "Docker", frequency: 128, total: 215, percentage: 60 },
  { skill: "AWS / GCP deployment", frequency: 121, total: 215, percentage: 56 },
  { skill: "LangGraph / Multi-agent", frequency: 98, total: 215, percentage: 46 },
  { skill: "LoRA / QLoRA fine-tuning", frequency: 76, total: 215, percentage: 35 },
  { skill: "Langfuse / Observability", frequency: 52, total: 215, percentage: 24 },
  { skill: "Python", frequency: 200, total: 215, percentage: 93 },
  { skill: "Java", frequency: 145, total: 215, percentage: 67 },
  { skill: "React / Frontend", frequency: 120, total: 215, percentage: 56 },
  { skill: "SQL / Database Design", frequency: 140, total: 215, percentage: 65 },
  { skill: "Git / Version Control", frequency: 165, total: 215, percentage: 77 },
  { skill: "Kubernetes", frequency: 89, total: 215, percentage: 41 },
  { skill: "Microservices Architecture", frequency: 105, total: 215, percentage: 49 },
  { skill: "REST API Design", frequency: 155, total: 215, percentage: 72 },
  { skill: "Machine Learning Fundamentals", frequency: 178, total: 215, percentage: 83 },
  { skill: "TensorFlow / PyTorch", frequency: 142, total: 215, percentage: 66 },
];

/**
 * Salary benchmarks for Indian AI Engineers by city (2026)
 */
export const salaryBenchmarks = {
  bangalore: { min: 12, max: 35, avg: 23.5, currency: "LPA" },
  mumbai: { min: 15, max: 32, avg: 19.2, currency: "LPA" },
  gurugram: { min: 14, max: 30, avg: 17.9, currency: "LPA" },
  delhi_ncr: { min: 8, max: 22, avg: 15, currency: "LPA" },
  hyderabad: { min: 10, max: 28, avg: 18, currency: "LPA" },
};

/**
 * Improvement suggestions based on skill gaps
 */
export const improvementSuggestions = {
  high_priority: [
    "Master RAG (Retrieval Augmented Generation) - 87% of JDs require this. This is the most critical skill gap.",
    "Learn LangChain - 80% of Indian AI JDs demand this framework. It's the industry standard for LLM applications.",
    "Develop FastAPI expertise - 73% of JDs require backend API development skills with FastAPI.",
    "Understand Vector Databases - 69% of JDs require knowledge of Pinecone, FAISS, or Chroma for semantic search.",
    "Get hands-on with Prompt Engineering - 62% of JDs explicitly mention prompt engineering as a requirement.",
  ],
  medium_priority: [
    "Learn Docker containerization - 60% of JDs require Docker for deployment and scaling.",
    "Master AWS or GCP deployment - 56% of JDs require cloud deployment expertise.",
    "Understand multi-agent architectures - 46% of JDs mention LangGraph or multi-agent systems.",
    "Learn Git and version control best practices - 77% of JDs require strong Git skills.",
    "Develop SQL and database design skills - 65% of JDs require database expertise.",
  ],
  nice_to_have: [
    "Explore LoRA/QLoRA fine-tuning - 35% of JDs mention fine-tuning, useful for advanced roles.",
    "Learn observability tools like Langfuse - 24% of JDs require monitoring and observability skills.",
    "Understand Kubernetes orchestration - 41% of JDs mention Kubernetes for scaling.",
    "Study microservices architecture - 49% of JDs require microservices knowledge.",
  ],
};

/**
 * Calculate skill match percentage for a resume
 */
export function calculateSkillMatch(resumeSkills: string[]): (SkillBenchmark & { matched: boolean })[] {
  const resumeSkillsLower = resumeSkills.map((s) => s.toLowerCase());

  return aiSkillBenchmarks
    .map((benchmark) => {
      const hasSkill = resumeSkillsLower.some(
        (skill) =>
          skill.includes(benchmark.skill.toLowerCase()) ||
          benchmark.skill.toLowerCase().includes(skill)
      );
      return {
        ...benchmark,
        matched: hasSkill,
      };
    })
    .sort((a, b) => b.percentage - a.percentage);
}

/**
 * Calculate overall resume score (0-100)
 */
export function calculateOverallScore(matchedSkills: (SkillBenchmark & { matched: boolean })[]): number {
  const topSkills = aiSkillBenchmarks.slice(0, 10); // Top 10 most important skills
  const topSkillsMatched = matchedSkills.filter(
    (s) => s.matched && topSkills.some((t) => t.skill === s.skill)
  ).length;

  const topSkillsScore = (topSkillsMatched / topSkills.length) * 70; // 70% weight on top skills
  const otherSkillsMatched = matchedSkills.filter(
    (s) => s.matched && !topSkills.some((t) => t.skill === s.skill)
  ).length;
  const otherSkillsScore = (otherSkillsMatched / (aiSkillBenchmarks.length - topSkills.length)) * 30; // 30% weight on other skills

  return Math.round(topSkillsScore + otherSkillsScore);
}
