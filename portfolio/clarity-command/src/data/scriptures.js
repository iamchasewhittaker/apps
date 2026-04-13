// LDS scripture bank for Clarity Command daily identity truths.
// Each entry: { ref, text, theme, convictionMsg }
// convictionMsg is shown when the user misses targets (tied to the theme).

export const SCRIPTURES = [
  {
    ref: "D&C 58:27",
    text: "Verily I say, men should be anxiously engaged in a good cause, and do many things of their own free will, and bring to pass much righteousness.",
    theme: "urgency",
    convictionMsg: "'Anxiously engaged' means you move with urgency — every day, not someday. What did you do today?",
  },
  {
    ref: "1 Nephi 3:7",
    text: "I will go and do the things which the Lord hath commanded, for I know that the Lord giveth no commandments unto the children of men, save he shall prepare a way for them that they may accomplish the thing which he commandeth them.",
    theme: "obedience",
    convictionMsg: "Nephi didn't say 'I'll try.' He said 'I will go and do.' Which one are you saying today?",
  },
  {
    ref: "D&C 123:17",
    text: "Therefore, dearly beloved brethren, let us cheerfully do all things that lie in our power; and then may we stand still, with the utmost assurance, to see the salvation of God.",
    theme: "effort",
    convictionMsg: "Cheerfully. Not reluctantly, not 'when I feel like it.' Do all things in your power — then trust God.",
  },
  {
    ref: "Mosiah 4:27",
    text: "And see that all these things are done in wisdom and order; for it is not requisite that a man should run faster than he has strength. And again, it is expedient that he should be diligent, that thereby he might win the prize.",
    theme: "diligence",
    convictionMsg: "Diligent — not frantic, not paralyzed. Steady, consistent effort every single day.",
  },
  {
    ref: "D&C 88:119",
    text: "Organize yourselves; prepare every needful thing; and establish a house, even a house of prayer, a house of fasting, a house of faith, a house of learning, a house of glory, a house of order, a house of God.",
    theme: "order",
    convictionMsg: "Organize yourself. Your family needs a house of order — and it starts with your daily discipline.",
  },
  {
    ref: "Alma 37:6",
    text: "Now ye may suppose that this is foolishness in me; but behold I say unto you, that by small and simple things are great things brought to pass.",
    theme: "consistency",
    convictionMsg: "Small and simple things — 5 job actions, 15 min of scripture, one check-in. Day by day. That's how great things happen.",
  },
  {
    ref: "Ether 12:27",
    text: "And if men come unto me I will show unto them their weakness. I give unto men weakness that they may be humble; and my grace is sufficient for all men that humble themselves before me.",
    theme: "grace",
    convictionMsg: "God gave you weakness to humble you, not to excuse you. His grace is sufficient — but it requires you to show up.",
  },
  {
    ref: "D&C 121:7–8",
    text: "My son, peace be unto thy soul; thine adversity and thine afflictions shall be but a small moment; And then, if thou endure it well, God shall exalt thee on high.",
    theme: "endurance",
    convictionMsg: "A small moment. The hard season you're in will pass — but only if you endure it well. Push through today.",
  },
  {
    ref: "Joshua 1:9",
    text: "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the Lord thy God is with thee whithersoever thou goest.",
    theme: "courage",
    convictionMsg: "Be strong and courageous — not when you feel ready, but now. The Lord is with you. Lead your family from strength.",
  },
  {
    ref: "1 Timothy 5:8",
    text: "But if any provide not for his own, and specially for those of his own house, he hath denied the faith, and is worse than an infidel.",
    theme: "provision",
    convictionMsg: "Providing for your family is a matter of faith. This isn't optional. Your family needs you to work.",
  },
  {
    ref: "Proverbs 6:6–8",
    text: "Go to the ant, thou sluggard; consider her ways, and be wise: Which having no guide, overseer, or ruler, provideth her meat in the summer, and gathereth her food in the harvest.",
    theme: "initiative",
    convictionMsg: "The ant doesn't wait to be told. She doesn't need a boss to make her work. Get up and go.",
  },
  {
    ref: "2 Nephi 2:25",
    text: "Adam fell that men might be; and men are, that they might have joy.",
    theme: "purpose",
    convictionMsg: "You were made for joy — not the joy of ease, but the joy of purpose fulfilled. Work is part of that joy.",
  },
  {
    ref: "D&C 58:26",
    text: "For behold, it is not meet that I should command in all things; for he that is compelled in all things, the same is a slothful and not a wise servant.",
    theme: "initiative",
    convictionMsg: "God isn't going to make every move for you. He's waiting to see what you do on your own. Be a wise servant.",
  },
  {
    ref: "Mosiah 2:17",
    text: "And behold, I tell you these things that ye may learn wisdom; that ye may learn that when ye are in the service of your fellow beings ye are only in the service of your God.",
    theme: "service",
    convictionMsg: "Providing for your wife and children is service. Service to them is service to God. That's the calling in front of you.",
  },
  {
    ref: "Helaman 5:12",
    text: "And now, my sons, remember, remember that it is upon the rock of our Redeemer, who is Christ, the Son of God, that ye must build your foundation.",
    theme: "foundation",
    convictionMsg: "Build on the rock. When the storms come — and they come — only what's built on Christ will hold. Start there today.",
  },
];

// Get today's scripture based on day-of-year rotation
export const getTodayScripture = (customScriptures = []) => {
  const all = [...SCRIPTURES, ...customScriptures];
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return all[dayOfYear % all.length];
};
