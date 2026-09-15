/**
 * brainstorm.js — Tool 9: wf_brainstorm
 * 
 * Generate brainstorming framework output.
 * Mengacu ke Section 17 BRAINSTORMING FRAMEWORK.
 */

const designThinkingPhases = [
  {
    name: 'Empathize',
    desc: 'Understand users through research and observation',
    activities: ['User interviews (5-8 per persona)', 'Contextual observation', 'Diary studies', 'Empathy mapping', 'Customer journey mapping'],
  },
  {
    name: 'Define',
    desc: 'Frame the problem clearly based on insights',
    activities: ['Point of View (POV) statements', 'How Might We questions', 'Problem statement formulation', 'User needs prioritization'],
  },
  {
    name: 'Ideate',
    desc: 'Generate many possible solutions',
    activities: ['Brainstorming (quantity > quality)', 'Crazy 8s', 'Worst Possible Idea', 'SCAMPER technique', 'Mind mapping'],
  },
  {
    name: 'Prototype',
    desc: 'Build tangible representations of ideas',
    activities: ['Paper prototyping', 'Figma low-fi → hi-fi', 'Clickable prototype', 'Wizard of Oz', 'Code prototype'],
  },
  {
    name: 'Test',
    desc: 'Validate solutions with real users',
    activities: ['Usability testing', 'A/B testing', 'Analytics review', 'Feedback synthesis', 'Iteration planning'],
  },
];

const ideationTechniques = [
  {
    name: 'Crazy 8s',
    time: '8 minutes',
    desc: 'Fold paper into 8 sections. Draw 1 idea every 60 seconds. End with 8 distinct solutions.',
  },
  {
    name: 'SCAMPER',
    desc: 'Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Reverse',
  },
  {
    name: 'Worst Possible Idea',
    desc: 'Find the WORST idea. Why is it bad? Reverse into insight. Removes inhibition.',
  },
  {
    name: 'Round Robin',
    desc: 'Write idea (3 min) → Pass right → Add/modify (2 min) → Repeat until original returns.',
  },
];

const priorityFrameworks = [
  {
    name: 'RICE',
    formula: 'Reach × Impact × Confidence / Effort',
    use: 'Feature prioritization',
  },
  {
    name: 'ICE',
    formula: 'Impact × Confidence × Ease',
    use: 'Growth experiments',
  },
  {
    name: 'MoSCoW',
    categories: 'Must-have / Should-have / Could-have / Won\'t-have',
    use: 'Release scoping',
  },
  {
    name: 'Effort-Impact',
    desc: '2×2 matrix: Quick Wins, Big Bets, Fill-ins, Avoid',
    use: 'Strategic planning',
  },
];

export function generateBrainstorm(params = {}) {
  const {
    mode = 'decompose',
    topic = '',
    format = 'markdown',
  } = params;

  let output = '';

  if (mode === 'decompose') {
    output += `# Brief Decomposition ${topic ? `— ${topic}` : ''}\n\n`;
    output += '| Element | Question | Answer |\n';
    output += '|---------|----------|--------|\n';
    output += '| **WHO** | Siapa target user? | |\n';
    output += '| **WHAT** | Apa yang harus dibangun? | |\n';
    output += '| **WHY** | Kenapa ini penting? | |\n';
    output += '| **WHERE** | Platform apa? | |\n';
    output += '| **WHEN** | Deadline kapan? | |\n';
    output += '| **HOW** | Stack & constraint? | |\n';
    output += '| **SUCCESS** | Gimana kita tahu berhasil? | |\n';
    output += '| **RISKS** | Apa resikonya? | |\n';
    output += '| **ASSUMPTIONS** | Apa yang diasumsikan? | |\n';
  }

  if (mode === 'persona') {
    output += `# User Persona Canvas ${topic ? `— ${topic}` : ''}\n\n`;
    output += '## [Persona Name]\n';
    output += '*"[Quote that captures their attitude]"*\n\n';
    output += '### Demographics\n';
    output += '- Age: \n';
    output += '- Occupation: \n';
    output += '- Location: \n';
    output += '- Tech Literacy: Low / Medium / High\n\n';
    output += '### Goals & Motivations\n';
    output += '- Primary goal: \n';
    output += '- What drives them? \n\n';
    output += '### Pain Points\n';
    output += '- 🔴 [Biggest frustration]\n';
    output += '- 🟡 [Medium frustration]\n\n';
    output += '### Needs\n';
    output += '- [Must-have]\n';
    output += '- [Should-have]\n';
    output += '- [Nice-to-have]\n';
  }

  if (mode === 'problem') {
    output += '# Problem Statement Formula\n\n';
    output += '```\n[User type] needs [user need] because [insight].\nUnlike [alternative], our solution [differentiator].\n```\n\n';
    output += '### Template:\n\n';
    output += `**Target user:**\n\n`;
    output += `**User need:**\n\n`;
    output += `**Insight:**\n\n`;
    output += `**Alternative:**\n\n`;
    output += `**Differentiator:**\n`;

    if (topic) {
      output += `\n\n**Topic: ${topic}**\n\n`;
      output += `→ Fill in the blanks to create your problem statement.`;
    }
  }

  if (mode === 'session') {
    output += '# Brainstorming Session Template\n\n';
    output += `## Topic: ${topic || '[Enter topic]'}\n\n`;
    output += '### Prep (before session)\n';
    output += '- [ ] Brief distributed 48h before\n';
    output += '- [ ] Research & inspiration board ready\n';
    output += '- [ ] Tools: Miro / FigJam / whiteboard + sticky notes\n';
    output += '- [ ] Timer ready\n';
    output += '- [ ] Roles: Facilitator, Note-taker, Time-keeper\n\n';
    output += '### Agenda (90 min)\n\n';
    output += '| Time | Activity | Format |\n';
    output += '|------|----------|--------|\n';
    output += '| 0:00 | Context setting | Present |\n';
    output += '| 0:15 | How Might We reframing | Group |\n';
    output += '| 0:25 | Crazy 8s | Individual |\n';
    output += '| 0:35 | Round Robin | Group |\n';
    output += '| 0:50 | Gallery walk | Silent |\n';
    output += '| 1:00 | Critique & dot voting | Group |\n';
    output += '| 1:15 | Converge + action items | Group |\n';
    output += '| 1:30 | Wrap + next steps | Present |\n\n';
    output += '### Output\n';
    output += '- Top 3 ideas selected\n';
    output += '- Action items with owners\n';
    output += '- Follow-up: prototype plan\n';
  }

  if (mode === 'decision-matrix') {
    output += '# Decision Matrix\n\n';
    output += '| Criteria | Weight | Option A | Option B | Option C |\n';
    output += '|----------|--------|----------|----------|----------|\n';
    output += '| User impact | 30% | / | / | / |\n';
    output += '| Implementation effort | 25% | / | / | / |\n';
    output += '| Business value | 20% | / | / | / |\n';
    output += '| Technical risk | 15% | / | / | / |\n';
    output += '| Maintenance cost | 10% | / | / | / |\n';
    output += '| **TOTAL** | **100%** | | | |\n\n';
    output += '### Priority Frameworks\n\n';
    priorityFrameworks.forEach(f => {
      output += `**${f.name}**: ${f.formula || f.categories || f.desc} — ${f.use}\n\n`;
    });
  }

  if (mode === 'design-thinking') {
    output += '# Design Thinking Process\n\n';
    designThinkingPhases.forEach((phase, i) => {
      output += `### Phase ${i + 1}: ${phase.name}\n`;
      output += `${phase.desc}\n\n`;
      phase.activities.forEach(a => output += `- ${a}\n`);
      output += '\n';
    });
  }

  if (mode === 'ideation') {
    output += '# Ideation Techniques\n\n';
    ideationTechniques.forEach(t => {
      output += `## ${t.name}\n`;
      if (t.time) output += `⏱️ ${t.time}\n`;
      output += `${t.desc}\n\n`;
    });
  }

  return output;
}
