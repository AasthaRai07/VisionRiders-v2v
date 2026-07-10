import { NextResponse } from 'next/server';

// --- Offline Fallback Q&A --------------------------------------------------
// Each entry has trigger keywords (any single match is enough) and the
// canonical answer to return when the Groq API is unavailable.
// ALL strings use backtick template literals to avoid apostrophe collisions.
const FALLBACK_QA = [
  {
    keywords: [
      'prepare', 'product manager', 'pm interview', 'pm intervie',
      'pm intervew', 'product management interview', 'interview prep',
    ],
    answer: `Focus on three areas: product sense (walk through how you'd design or improve a product), metrics (how you'd measure success), and behavioral questions using the STAR method - Situation, Task, Action, Result. Practice explaining past decisions with clear, measurable outcomes.`,
  },
  {
    keywords: ['star method', 'star framework', 'star format', 'situation task action result'],
    answer: `STAR stands for Situation, Task, Action, Result. It's a framework for answering behavioral interview questions - describe the context, what you needed to do, what you actually did, and the measurable outcome. Interviewers use it to judge real impact, not just intentions.`,
  },
  {
    keywords: ['find a mentor', 'find mentor', 'get a mentor', 'mentorship', 'find industry mentor'],
    answer: `Look for people 1-2 levels ahead of you in a role you want next, not just senior leaders - they remember the exact challenges you're facing now. Use platforms like this one, LinkedIn, or alumni networks, and lead with a specific question rather than a vague "can you mentor me."`,
  },
  {
    keywords: ['negotiate salary', 'salary negotiation', 'higher salary', 'negotiate pay', 'ask for raise'],
    answer: `Research the market range for your role and location first. Let the employer name a number before you do if possible. Anchor on your specific, quantified impact rather than personal need, and always ask for the offer in writing before responding.`,
  },
  {
    keywords: ['switch career', 'career switch', 'career change', 'skills to learn', 'change career', 'new career'],
    answer: `Identify the overlap between your current skills and the target role first - most career switches reuse 40-60% of existing skills. Then focus on the specific gap, not everything the new field involves, and look for a project or certification that proves it concretely.`,
  },
  {
    keywords: ['biggest weakness', 'greatest weakness', 'what is your weakness', "what's your weakness"],
    answer: `Pick a real weakness, not a disguised strength like "I work too hard." Explain the specific step you're taking to address it and one concrete sign of progress. Authenticity reads better than a rehearsed dodge.`,
  },
  {
    keywords: [
      'resume length', 'how long resume', 'resume page', 'one page resume',
      'two page resume', 'how long should my resume', 'resume be', 'resume size',
    ],
    answer: `One page if you have under 8-10 years of experience, two pages max otherwise. Prioritise measurable outcomes over task lists - "increased retention by 25%" beats "responsible for user retention."`,
  },
  {
    keywords: ['tell me about yourself', 'introduce yourself', 'talk about yourself', 'about yourself'],
    answer: `Keep it under 90 seconds: current role and focus, one or two relevant past experiences that build toward this role, and why you want this specific position now. Avoid a full chronological life story.`,
  },
  {
    keywords: ['questions to ask interviewer', 'ask the interviewer', 'questions for interviewer', 'what to ask'],
    answer: `Ask about how success is measured in the role in the first 90 days, what has changed on the team recently, or a challenge they're currently trying to solve. These signal genuine interest and give you real information, unlike generic culture questions.`,
  },
  {
    keywords: ['interview anxiety', 'nervous for interview', 'interview nerves', 'interview stress', 'anxious about interview'],
    answer: `Prepare 3-4 core stories you can adapt to different questions instead of memorising exact answers - this reduces the panic when a question is phrased unexpectedly. Practice out loud, not just in your head, since that's a different skill.`,
  },
];

/**
 * Returns a matched fallback answer or null if nothing matches.
 * Matching: lower-case substring check against all keywords in each cluster.
 */
function getFallbackResponse(userMessage) {
  if (!userMessage) return null;
  const lower = userMessage.toLowerCase();
  for (const qa of FALLBACK_QA) {
    const matched = qa.keywords.some((kw) => lower.includes(kw.toLowerCase()));
    if (matched) return qa.answer;
  }
  return null;
}

/**
 * Wraps a fallback answer in a NextResponse with fallback:true.
 * Always logs to console so you can track API failure frequency.
 */
function offlineResponse(answer) {
  if (answer) {
    console.warn('[Nova Fallback] Groq API unavailable - serving keyword-matched offline answer.');
    return NextResponse.json({ reply: answer, toolCalls: [], fallback: true });
  }
  console.warn('[Nova Fallback] Groq API unavailable - no keyword match, returning honest error.');
  return NextResponse.json({
    reply: "I'm having trouble connecting right now - please try again in a moment.",
    toolCalls: [],
    fallback: true,
  });
}

// --- Main Handler -----------------------------------------------------------
export async function POST(request) {
  try {
    const { messages, userContext, initGreeting } = await request.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        {
          reply:
            'Error: GROQ_API_KEY is missing from environment variables (.env.local). Please configure it to enable live Groq AI responses.',
          toolCalls: [],
        },
        { status: 500 }
      );
    }

    const resumeText = userContext?.resumeText || 'Not provided yet';
    const skills = userContext?.skills || [];
    const fullName = userContext?.fullName || 'there';
    const careerGoal = userContext?.careerGoal || 'career growth';

    const systemInstruction = `You are Nova, an expert AI Career Mentor, Interview Coach, and Educational Advisor for HerNova.
You have direct access to the user's real profile and resume:
- Name: ${fullName}
- Career Goal: ${careerGoal}
- Skills: ${skills.join(', ')}
- Full Resume Text: ${resumeText}

CORE DIRECTIVES:
1. Focus entirely on career development, job search strategies, resume/skill feedback, interview preparation (including the STAR method), mentorship guidance, and education/career-path questions (including exam preparation, academic planning, certifications, university choices, and career-relevant courses).
2. If the user asks about a legitimate career-adjacent or educational topic (like preparing for entrance exams, choosing between degree programs, or building technical projects), assist them thoroughly and tie your advice back to their long-term professional trajectory when appropriate.
3. ONLY redirect if the query is genuinely completely unrelated to education, skills, career, or professional growth (such as asking for cooking recipes, local weather reports, celebrity gossip, or movies). When redirecting for genuinely unrelated topics, politely guide them back to career development in exactly ONE sentence.
4. Always generate authentic, personalized, encouraging responses that actively leverage or reference specific details from their resume or skills when relevant.
5. When the user explicitly asks for mentors, industry leaders, or finding a guide on a topic, call the 'search_mentors' tool.
6. When the user explicitly asks to start or practice an interview, STAR answers, or behavioral questions, call the 'start_interview_practice' tool.
IMPORTANT ON TOOL CALLING: Do NOT generate raw XML or <tool_call> tags in your text response. Only call a tool when explicitly requested, using the native function calling interface. If answering a general career, resume, or educational question without a tool request, just answer directly in clear text without calling any tools.`;

    const tools = [
      {
        type: 'function',
        function: {
          name: 'search_mentors',
          description: 'Returns mentor profile data to render interactive mentor cards inside the chat.',
          parameters: {
            type: 'object',
            properties: {
              topic: { type: 'string', description: 'The industry, topic, or role for which mentors are requested.' },
            },
            required: ['topic'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'start_interview_practice',
          description: 'Starts an interview practice flow and renders the STAR-method comparison card inside the chat.',
          parameters: {
            type: 'object',
            properties: {
              role: { type: 'string', description: 'The job role being practiced.' },
            },
            required: ['role'],
          },
        },
      },
    ];

    // -- 1. Initial Greeting (no tool calls needed) --------------------------
    if (initGreeting) {
      let groqRes;
      try {
        groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            messages: [
              { role: 'system', content: systemInstruction },
              {
                role: 'user',
                content:
                  'Generate a short, warm, personalized 2-sentence greeting to start the mentoring session, welcoming the user by name and acknowledging their current career goal and skills.',
              },
            ],
          }),
        });
      } catch (networkErr) {
        console.warn('[Nova Fallback] Groq network error during greeting:', networkErr.message);
        return NextResponse.json({
          reply: `Welcome back, ${fullName}! I'm having a brief connection issue but I'm here to help with your career goals.`,
          toolCalls: [],
          fallback: true,
        });
      }

      if (!groqRes.ok) {
        console.warn(`[Nova Fallback] Groq greeting failed (${groqRes.status}) - serving static fallback greeting.`);
        return NextResponse.json({
          reply: `Welcome back, ${fullName}! I'm having a brief connection issue but I'm here to help with your career goals.`,
          toolCalls: [],
          fallback: true,
        });
      }

      const data = await groqRes.json();
      const reply =
        data?.choices?.[0]?.message?.content ||
        `Welcome back, ${fullName}! Let's work together on your career goals today.`;
      return NextResponse.json({ reply, toolCalls: [] });
    }

    // -- 2. Multi-turn Chat (with tool calls) --------------------------------
    const lastUserMessage =
      [...(messages || [])].reverse().find((m) => m.role === 'user')?.content || '';

    const groqMessages = [
      { role: 'system', content: systemInstruction },
      ...(messages || []).map((m) => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.content || '',
      })),
    ];

    let groqRes;
    try {
      groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          temperature: 0.7,
          messages: groqMessages,
          tools: tools,
        }),
      });
    } catch (networkErr) {
      // Hard network failure (DNS, timeout, etc.) - trigger offline fallback
      console.warn('[Nova Fallback] Groq network error:', networkErr.message);
      return offlineResponse(getFallbackResponse(lastUserMessage));
    }

    // Handle HTTP-level errors from Groq
    if (!groqRes.ok) {
      const errorText = await groqRes.text();
      let errorMessage = errorText;
      let failedGenText = null;
      try {
        const errJson = JSON.parse(errorText);
        if (errJson.error?.message) errorMessage = errJson.error.message;
        if (errJson.error?.failed_generation) failedGenText = errJson.error.failed_generation;
      } catch (_) {}

      // Groq rejected a malformed <tool_call> block - extract readable text or retry without tools
      if (groqRes.status === 400 && (errorMessage.includes('Failed to call a function') || failedGenText)) {
        if (failedGenText) {
          const cleanedText = failedGenText.replace(/<tool_call>[\s\S]*?<\/tool_call>/g, '').trim();
          if (cleanedText.length > 20) {
            return NextResponse.json({ reply: cleanedText, toolCalls: [] });
          }
        }
        // Retry without tools so the model returns plain text
        const retryRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            messages: groqMessages,
          }),
        });
        if (retryRes.ok) {
          const retryData = await retryRes.json();
          const retryReply =
            retryData?.choices?.[0]?.message?.content ||
            'Here is how to approach this based on your profile and skills...';
          return NextResponse.json({ reply: retryReply, toolCalls: [] });
        }
      }

      // Rate limit (429), auth error (401), or other HTTP errors -> offline fallback
      console.warn(`[Nova Fallback] Groq returned HTTP ${groqRes.status} - triggering offline fallback.`);
      return offlineResponse(getFallbackResponse(lastUserMessage));
    }

    // -- 3. Success path - parse Groq response -------------------------------
    const data = await groqRes.json();
    const choice = data?.choices?.[0]?.message || {};
    let reply = choice.content || '';
    const toolCalls = [];

    if (choice.tool_calls && choice.tool_calls.length > 0) {
      for (const tc of choice.tool_calls) {
        let args = {};
        try {
          args =
            typeof tc.function.arguments === 'string'
              ? JSON.parse(tc.function.arguments)
              : tc.function.arguments;
        } catch (e) {
          console.error('Error parsing Groq tool arguments:', e);
        }
        toolCalls.push({ name: tc.function.name, arguments: args });
      }

      if (!reply || !reply.trim()) {
        if (toolCalls.some((tc) => tc.name === 'search_mentors')) {
          reply =
            "I've matched you with top industry mentors aligned with your career trajectory. Check out their profiles below to schedule a session right away:";
        } else if (toolCalls.some((tc) => tc.name === 'start_interview_practice')) {
          reply =
            "Let's practice your interview storytelling using the STAR framework. Below is a side-by-side breakdown showing how to structure your response into a high-impact leadership narrative:";
        } else {
          reply = 'Here are the resources tailored specifically for your request:';
        }
      }
    }

    return NextResponse.json({ reply, toolCalls });
  } catch (error) {
    console.error('Error handling Groq chat:', error);
    return NextResponse.json(
      {
        reply: `I encountered a network or system issue connecting to Groq: ${error.message || 'Unknown error'}. Please try sending your message again.`,
        toolCalls: [],
      },
      { status: 500 }
    );
  }
}
