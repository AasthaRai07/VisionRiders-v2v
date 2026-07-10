/**
 * Seed script for HerNova Community data.
 * Run: node scripts/seedCommunity.js
 */
const admin = require('firebase-admin');
const path = require('path');

// Initialize with emulator settings
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
admin.initializeApp({ projectId: 'hernova-13f01' });
const db = admin.firestore();

const POSTS = [
  {
    display_name: "Priya K.",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnRk5OUF0weYzRdcLFqsdR4DKiud7CDMq7juQ8NGqwil1JjFUJBzF3n9oxTR_iRdzUrR6N4ZvIWVMqUePivpVTv6Wt_wLQ-DWy_uS_tBHuG8_R2dP52oeL_14v0qnikFA-fxlh9OV-4j_JjjL48ACKl8CW-2c9ZQXgQ1fns9V6dFsv1eXtQ4A5Ty3kEx_TjilVbXFvw8jrkOOWujR2qHsRNdqJG_rc_ecX9qnSeKd_56_BVtbdK3kEb5fcVxpmHSYA0P8PlWltjK4",
    category: "Career Talk",
    post_text: "Just landed my first returnship interview! 🌟 So thankful for the mentor matches here. The resume review workshop last week really helped me articulate my career gap confidently.",
    support_count: 42,
    comment_count: 3,
    user_id: "seed-user-priya",
    _internal_user_id: "seed-user-priya",
    is_anonymous: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2h ago
  },
  {
    display_name: "Sarah M.",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDii4Nm7Cv9cH1YvoyKByYRIhaV6PkiatBkME2if6X8ONt8TJpfpt7BluM6ya4_wRwQ0i_XD51mMdRHH2sD3R3n9EsKtnjfWZPZXT3WKfTlNLQY_gFOoKWjcd6TIAWcm87GsHrI8AbXeMeasLylw1P6u4uQzlmLdKIWCV4IN_lz1W0Et6QURWCIwH68RM1FBYOxW9lpoF8Gz76KbaasNEaoWgzZIROonKRKKFkiHn11NKnRKeAXXCoFSQDkyAgyogKH0_lbm4Iajp4",
    category: "Wins & Support",
    post_text: "Finally negotiated that raise! It was terrifying, but I used the scripts from the Finance module and it actually worked. Don't underestimate your worth, ladies! 💪💸",
    support_count: 128,
    comment_count: 3,
    user_id: "seed-user-sarah",
    _internal_user_id: "seed-user-sarah",
    is_anonymous: false,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5h ago
  },
  {
    display_name: "Elena M.",
    avatar_url: null,
    category: "Wellness",
    post_text: "Reminder to step away from the screen today. I've been feeling burnt out, taking a small mental health day makes a huge difference. How is everyone managing work-life balance this week?",
    support_count: 89,
    comment_count: 3,
    user_id: "seed-user-elena",
    _internal_user_id: "seed-user-elena",
    is_anonymous: false,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1d ago
  },
  {
    display_name: "Anonymous",
    avatar_url: null,
    category: "Money Matters",
    post_text: "Is anyone else struggling with student loans while trying to save for an emergency fund? I feel like I'm drowning. Would love tips on budgeting strategies that actually work for early-career women.",
    support_count: 67,
    comment_count: 2,
    user_id: null,
    _internal_user_id: "seed-user-anon1",
    is_anonymous: true,
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3h ago
  },
  {
    display_name: "Meera R.",
    avatar_url: null,
    category: "Career Talk",
    post_text: "Completed my first open-source contribution today! 🎉 It was a small documentation fix, but the maintainers were so welcoming. Highly recommend hacktoberfest repos for beginners.",
    support_count: 54,
    comment_count: 2,
    user_id: "seed-user-meera",
    _internal_user_id: "seed-user-meera",
    is_anonymous: false,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8h ago
  },
  {
    display_name: "Aisha T.",
    avatar_url: null,
    category: "Wins & Support",
    post_text: "Got accepted into the Google Women Techmakers program! The application process was nerve-wracking but the community here helped me craft a strong statement of intent. Grateful beyond words 🙏",
    support_count: 201,
    comment_count: 3,
    user_id: "seed-user-aisha",
    _internal_user_id: "seed-user-aisha",
    is_anonymous: false,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12h ago
  }
];

const COMMENTS_MAP = {
  // Index 0 = Priya's post
  0: [
    { display_name: "Sarah M.", user_id: "seed-user-sarah", _internal_user_id: "seed-user-sarah", comment_text: "So proud of you, Priya! You've come so far. Wishing you the best for the interview 💪", is_anonymous: false },
    { display_name: "Anonymous", user_id: null, _internal_user_id: "seed-user-anon2", comment_text: "I'm in a similar boat — the mentor matching was a game changer for me too. Good luck!", is_anonymous: true },
    { display_name: "Meera R.", user_id: "seed-user-meera", _internal_user_id: "seed-user-meera", comment_text: "Which workshop was this? I'd love to attend the next one!", is_anonymous: false }
  ],
  // Index 1 = Sarah's post
  1: [
    { display_name: "Priya K.", user_id: "seed-user-priya", _internal_user_id: "seed-user-priya", comment_text: "Queen behavior 👑 What was the toughest part of the negotiation?", is_anonymous: false },
    { display_name: "Elena M.", user_id: "seed-user-elena", _internal_user_id: "seed-user-elena", comment_text: "Amazing! The Finance module scripts are legit. Everyone should try them.", is_anonymous: false },
    { display_name: "Aisha T.", user_id: "seed-user-aisha", _internal_user_id: "seed-user-aisha", comment_text: "This is exactly the motivation I needed today! 🙌", is_anonymous: false }
  ],
  // Index 2 = Elena's post
  2: [
    { display_name: "Sarah M.", user_id: "seed-user-sarah", _internal_user_id: "seed-user-sarah", comment_text: "Taking a walk during lunch has been my saving grace. Even 15 minutes helps!", is_anonymous: false },
    { display_name: "Anonymous", user_id: null, _internal_user_id: "seed-user-anon3", comment_text: "I've been burning out too. Trying to set strict screen-off hours after 7pm.", is_anonymous: true },
    { display_name: "Meera R.", user_id: "seed-user-meera", _internal_user_id: "seed-user-meera", comment_text: "Journaling before bed has been a game changer for my stress levels. Try it!", is_anonymous: false }
  ],
  // Index 3 = Anonymous Money post
  3: [
    { display_name: "Sarah M.", user_id: "seed-user-sarah", _internal_user_id: "seed-user-sarah", comment_text: "The 50/30/20 rule helped me a lot. Even small amounts add up over time.", is_anonymous: false },
    { display_name: "Elena M.", user_id: "seed-user-elena", _internal_user_id: "seed-user-elena", comment_text: "Check out the Finance module on HerNova — it has a whole section on debt management strategies.", is_anonymous: false }
  ],
  // Index 4 = Meera's post
  4: [
    { display_name: "Aisha T.", user_id: "seed-user-aisha", _internal_user_id: "seed-user-aisha", comment_text: "Amazing first step! Open source can feel intimidating but it's so rewarding.", is_anonymous: false },
    { display_name: "Priya K.", user_id: "seed-user-priya", _internal_user_id: "seed-user-priya", comment_text: "Documentation contributions are SO valuable. Don't downplay them!", is_anonymous: false }
  ],
  // Index 5 = Aisha's post
  5: [
    { display_name: "Priya K.", user_id: "seed-user-priya", _internal_user_id: "seed-user-priya", comment_text: "Congratulations Aisha!! You totally deserved this! 🎉", is_anonymous: false },
    { display_name: "Sarah M.", user_id: "seed-user-sarah", _internal_user_id: "seed-user-sarah", comment_text: "This is HUGE! So happy for you! Can you share tips on the application?", is_anonymous: false },
    { display_name: "Elena M.", user_id: "seed-user-elena", _internal_user_id: "seed-user-elena", comment_text: "Well deserved! Google WTM is an incredible community.", is_anonymous: false }
  ]
};

async function seed() {
  console.log("🌱 Seeding community data...\n");

  // Clear existing data
  const existingPosts = await db.collection('community_posts').get();
  const existingComments = await db.collection('community_comments').get();
  const existingSupports = await db.collection('community_post_supports').get();

  const batch1 = db.batch();
  existingPosts.docs.forEach(d => batch1.delete(d.ref));
  existingComments.docs.forEach(d => batch1.delete(d.ref));
  existingSupports.docs.forEach(d => batch1.delete(d.ref));
  await batch1.commit();
  console.log("  Cleared existing community data.");

  // Seed posts
  for (let i = 0; i < POSTS.length; i++) {
    const post = POSTS[i];
    const postRef = await db.collection('community_posts').add(post);
    console.log(`  ✅ Post "${post.display_name}" (${post.category}) → ${postRef.id}`);

    // Seed comments for this post
    const comments = COMMENTS_MAP[i] || [];
    for (const comment of comments) {
      await db.collection('community_comments').add({
        ...comment,
        post_id: postRef.id,
        avatar_url: null,
        created_at: new Date(post.created_at.getTime() + Math.random() * 3600000)
      });
    }
    console.log(`     └─ ${comments.length} comments`);
  }

  console.log("\n🎉 Community seed complete!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
