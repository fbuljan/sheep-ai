export interface DisplayType {
  id: string;
  name: string;
  format: string;
  purpose: string;
}

export const displayTypes: DisplayType[] = [
  {
    id: 'micro_summary',
    name: 'Micro Summary',
    format: 'Ultra-compressed, one-sentence summary',
    purpose: 'Used in the feed; fastest way to decide if you want to open the article',
  },
  {
    id: 'tech_bullets',
    name: 'Tech Bullets',
    format: 'Short, precise bullet points (3-5 key points)',
    purpose: 'Best for technical readers (devs, secops, analysts)',
  },
  {
    id: 'timeline_view',
    name: 'Timeline View',
    format: 'Simple chronological event sequence',
    purpose: 'Perfect for understanding attack flow or incident progression',
  },
  {
    id: 'story_mode',
    name: 'Story Mode',
    format: 'Short narrative story',
    purpose: 'Human-friendly explanation, ideal for casual readers',
  },
  {
    id: 'podcast_snippet',
    name: 'Podcast Snippet',
    format: 'Written as if spoken in a podcast',
    purpose: 'For users who prefer audio-style summaries',
  },
  {
    id: 'student_explanation',
    name: 'Student Explanation',
    format: 'Clean, jargon-free breakdown',
    purpose: 'Ideal for students, junior developers, new learners',
  },
  {
    id: 'executive_summary',
    name: 'Executive Summary',
    format: 'High-level business-impact view',
    purpose: 'Communicates organizational and strategic risk for management',
  },
  {
    id: 'threat_actor_pov',
    name: 'Threat-Actor POV',
    format: "Written as the attacker's playbook",
    purpose: 'Useful for threat-intel and advanced readers',
  },
  {
    id: 'deep_structured_brief',
    name: 'Deep Structured Brief',
    format: 'Detailed, structured summary (200-300 words)',
    purpose: 'Complete, compressed version of the full article',
  },
  {
    id: 'video_reel_script',
    name: 'Video Reel Script',
    format: 'Script for short vertical video (15-25 sec)',
    purpose: 'For users who prefer fast, visual, social-media-style briefings',
  },
];
