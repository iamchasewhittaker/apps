export const MOCK_INTERVIEW_SCENARIOS = [
  {
    key: "behavioral",
    label: "Behavioral (STAR)",
    questions: [
      "Tell me about a time you had to manage multiple high-priority tasks at once. How did you stay organized?",
      "Describe a situation where you had to resolve a difficult problem for a customer or client.",
      "Give an example of a time you improved a process or workflow. What drove you to do it?",
      "Tell me about a time you made a mistake at work. What happened and what did you do?",
      "Describe a time you had to work cross-functionally with a team that had different goals than yours.",
      "Tell me about your most challenging customer interaction and how you handled it.",
      "Give an example of when you had to learn something quickly to meet a deadline or solve a problem.",
    ],
  },
  {
    key: "situational",
    label: "Situational",
    questions: [
      "If a merchant called frustrated that their transactions were failing right before a big sale weekend, what would you do?",
      "You discover a process gap that's causing delays for multiple clients. No one has asked you to fix it. What do you do?",
      "A client asks for a feature that doesn't exist. How do you handle the conversation?",
      "You're onboarding three clients simultaneously and one is falling behind. How do you prioritize?",
      "Your manager asks you to do something you think is the wrong approach. How do you handle it?",
      "You get a call from a client who is angry — not about something you did, but about a policy change. Walk me through your response.",
    ],
  },
  {
    key: "implementation",
    label: "Implementation / CS",
    questions: [
      "Walk me through how you would onboard a new merchant from contract signed to first live transaction.",
      "How do you handle a situation where a client's technical team is slow to respond during an integration?",
      "What do you do when a client's go-live date is at risk?",
      "Describe how you document client setups or integration steps so nothing falls through the cracks.",
      "How do you balance giving clients what they want vs. what they actually need?",
      "What metrics or signals do you watch to know if an account is healthy or at risk?",
    ],
  },
  {
    key: "payments",
    label: "Payments Domain",
    questions: [
      "Explain how a credit card transaction flows from swipe to settlement.",
      "What is a chargeback and what steps can a merchant take to reduce them?",
      "What's the difference between a payment gateway and a payment processor?",
      "How does fraud prevention typically work in a payment platform?",
      "A merchant asks why their funds aren't settling. What do you check first?",
      "What is PCI compliance and why does it matter for merchants?",
    ],
  },
  {
    key: "rolefit",
    label: "Role Fit / Motivation",
    questions: [
      "Why are you interested in this specific role?",
      "What do you know about our product and what drew you to apply?",
      "Where do you see yourself in three years?",
      "What kind of work environment brings out your best?",
      "What are you looking for in your next role that you didn't have before?",
      "Tell me about yourself — the 2-minute version relevant to this role.",
    ],
  },
  {
    key: "ic_payments",
    label: "Implementation Consultant — Payments",
    questions: [
      "Walk me through how you'd onboard a new enterprise merchant on Authorize.Net — from kickoff to first live transaction.",
      "A merchant's integration is failing in production two days before go-live. Their dev team is hard to reach. What's your play?",
      "Tell me about a time you resolved an integration issue without escalating. What made you able to handle it alone?",
      "How do you handle a merchant asking for a custom flow that isn't supported by the standard API?",
      "What does a healthy post-launch handoff to Support or CS look like, and who owns what?",
      "A merchant says webhooks are 'unreliable.' Walk me through how you'd diagnose and prove the root cause.",
    ],
  },
  {
    key: "se_devtools",
    label: "Sales Engineer — Dev Tools",
    questions: [
      "Walk me through a discovery call with a developer-led team. What are you listening for?",
      "A prospect asks for a POC. How do you scope it so it's winnable in a week and answers their real question?",
      "Whiteboard how you'd integrate our API into a merchant's existing checkout flow (you pick the stack).",
      "How do you handle a technical objection mid-demo that you don't immediately know the answer to?",
      "What's the difference between demoing features and demoing outcomes? Give an example.",
      "How do you partner with AEs vs. CS — where do you add leverage and where do you get out of the way?",
    ],
  },
];

export const STRENGTH_ANSWER_HOOKS = {
  Harmony: "I'm the person on a team who finds the thread everyone can agree on — especially when the call is going sideways.",
  Developer: "I get real satisfaction out of watching a teammate get better at something I coached them through. It's a quieter kind of win, but it's the one I chase.",
  Consistency: "I run on fairness and repeatability. If a process works for one merchant, it should work for the next one — and if it doesn't, that's the signal something's broken.",
  Context: "I look backward before I move forward. Most merchant issues I've solved faster than the team expected were because I'd seen the pattern before — or went looking for who had.",
  Individualization: "I read people fast and adjust. The way I'd talk to a CTO debugging a webhook is not the way I'd talk to the ops lead who just wants to know when funds settle. Same truth, different frame.",
};
