const fetch = require('node-fetch'); // or just use node's native fetch if available

async function run() {
  try {
    const res = await fetch('http://127.0.0.1:5001/hernova-13f01/us-central1/api/skill-gap/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resume_text: "test resume text",
        target_role: "Software Engineer",
        user_type: "professional",
        industry: "Tech"
      })
    });
    const text = await res.text();
    console.log(res.status, text);
  } catch(e) {
    console.error(e);
  }
}
run();
