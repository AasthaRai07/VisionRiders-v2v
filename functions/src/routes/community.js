const express = require('express');
const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');

const router = express.Router();
const db = () => admin.firestore();

// ─── Profanity Blocklist ───────────────────────────────────────────────────────
const BLOCKED_WORDS = [
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'dick', 'cunt',
  'nigger', 'faggot', 'retard', 'slut', 'whore', 'damn', 'piss',
  'cock', 'pussy', 'motherfucker', 'bullshit', 'dumbass'
];

function containsProfanity(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return BLOCKED_WORDS.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lower);
  });
}

// ─── Strip internal fields from a post before returning ────────────────────────
function sanitizePost(post) {
  const { _internal_user_id, ...publicPost } = post;
  return publicPost;
}

function sanitizeComment(comment) {
  const { _internal_user_id, ...publicComment } = comment;
  return publicComment;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. GET /posts — Fetch posts with category filter, cursor pagination,
//    and per-user has_user_supported computation
// ═══════════════════════════════════════════════════════════════════════════════
router.get('/posts', async (req, res) => {
  try {
    const { category, limit: limitParam, cursor } = req.query;
    const limit = Math.min(parseInt(limitParam) || 20, 50);

    let query = db().collection('community_posts')
      .orderBy('created_at', 'desc');

    // Category filter ("All" or empty = no filter)
    if (category && category !== 'All') {
      query = query.where('category', '==', category);
    }

    // Cursor-based pagination
    if (cursor) {
      const cursorDoc = await db().collection('community_posts').doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    query = query.limit(limit);
    const snapshot = await query.get();

    const posts = [];
    const userId = req.user ? req.user.uid : null;

    for (const doc of snapshot.docs) {
      const postData = { id: doc.id, ...doc.data() };

      // Compute has_user_supported
      let has_user_supported = false;
      if (userId) {
        const supportDoc = await db().collection('community_post_supports')
          .doc(`${doc.id}_${userId}`)
          .get();
        has_user_supported = supportDoc.exists;
      }

      posts.push({ ...sanitizePost(postData), has_user_supported });
    }

    // Next cursor = last doc id (or null if fewer than limit returned)
    const nextCursor = snapshot.docs.length === limit
      ? snapshot.docs[snapshot.docs.length - 1].id
      : null;

    res.json({ posts, nextCursor });
  } catch (error) {
    console.error("Error fetching community posts:", error);
    res.status(500).json({ error: "Failed to fetch community posts" });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// 2. POST /posts — Create a new post
// ═══════════════════════════════════════════════════════════════════════════════
router.post('/posts', async (req, res) => {
  try {
    const { category, post_text, is_anonymous, image_data } = req.body;

    if (!post_text || !post_text.trim()) {
      return res.status(400).json({ error: "Post text cannot be empty." });
    }
    if (!category) {
      return res.status(400).json({ error: "Category is required." });
    }

    // Profanity check
    if (containsProfanity(post_text)) {
      return res.status(400).json({ error: "Your post contains inappropriate language. Please revise and try again." });
    }

    // Rate limit: max 1 post per 30 seconds
    const recentPosts = await db().collection('community_posts')
      .where('_internal_user_id', '==', req.user.uid)
      .orderBy('created_at', 'desc')
      .limit(1)
      .get();

    if (!recentPosts.empty) {
      const lastPost = recentPosts.docs[0].data();
      if (lastPost.created_at) {
        const lastTime = lastPost.created_at.toDate ? lastPost.created_at.toDate() : new Date(lastPost.created_at);
        const elapsed = (Date.now() - lastTime.getTime()) / 1000;
        if (elapsed < 30) {
          return res.status(429).json({ error: `Please wait ${Math.ceil(30 - elapsed)} seconds before posting again.` });
        }
      }
    }

    // Build post data
    let display_name = "Anonymous";
    let avatar_url = null;
    let publicUserId = null;

    if (!is_anonymous) {
      const userDoc = await db().collection('users').doc(req.user.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        display_name = userData.name || (req.user.email ? req.user.email.split('@')[0] : "User");
        avatar_url = userData.avatar_url || userData.photoURL || null;
      } else {
        display_name = req.user.email ? req.user.email.split('@')[0] : "User";
      }
      publicUserId = req.user.uid;
    }

    const postData = {
      user_id: publicUserId,
      _internal_user_id: req.user.uid,   // Never exposed in GET responses
      display_name,
      avatar_url,
      category,
      post_text: post_text.trim(),
      image_url: image_data || null,
      support_count: 0,
      comment_count: 0,
      is_anonymous: !!is_anonymous,
      created_at: FieldValue.serverTimestamp()
    };

    const docRef = await db().collection('community_posts').add(postData);

    // Return the sanitized post with a client-side timestamp for immediate UI
    res.json({
      id: docRef.id,
      ...sanitizePost(postData),
      created_at: new Date().toISOString(),
      has_user_supported: false
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// 3. POST /posts/:postId/support — Toggle support (like/unlike)
// ═══════════════════════════════════════════════════════════════════════════════
router.post('/posts/:postId/support', async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.uid;

    const postRef = db().collection('community_posts').doc(postId);
    // Use a deterministic doc ID so we can read it inside a transaction
    const supportDocId = `${postId}_${userId}`;
    const supportRef = db().collection('community_post_supports').doc(supportDocId);

    const result = await db().runTransaction(async (transaction) => {
      const postDoc = await transaction.get(postRef);
      if (!postDoc.exists) {
        throw new Error('Post not found');
      }

      const supportDoc = await transaction.get(supportRef);

      let has_supported;
      let newCount;

      if (supportDoc.exists) {
        // Un-support: delete the support record, decrement count
        transaction.delete(supportRef);
        newCount = Math.max(0, (postDoc.data().support_count || 0) - 1);
        transaction.update(postRef, { support_count: newCount });
        has_supported = false;
      } else {
        // Support: create a record, increment count
        transaction.set(supportRef, {
          post_id: postId,
          user_id: userId,
          created_at: FieldValue.serverTimestamp()
        });
        newCount = (postDoc.data().support_count || 0) + 1;
        transaction.update(postRef, { support_count: newCount });
        has_supported = true;
      }

      return { support_count: newCount, has_supported };
    });

    res.json(result);
  } catch (error) {
    console.error("Error toggling support:", error);
    if (error.message === 'Post not found') {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(500).json({ error: "Failed to toggle support" });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// 4. GET /posts/:postId/comments — Fetch comments for a post
// ═══════════════════════════════════════════════════════════════════════════════
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const snapshot = await db().collection('community_comments')
      .where('post_id', '==', postId)
      .orderBy('created_at', 'asc')
      .get();

    const comments = snapshot.docs.map(doc => sanitizeComment({ id: doc.id, ...doc.data() }));
    res.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// 5. POST /posts/:postId/comments — Add a comment
// ═══════════════════════════════════════════════════════════════════════════════
router.post('/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment_text, is_anonymous } = req.body;

    if (!comment_text || !comment_text.trim()) {
      return res.status(400).json({ error: "Comment text cannot be empty." });
    }

    // Profanity check
    if (containsProfanity(comment_text)) {
      return res.status(400).json({ error: "Your comment contains inappropriate language. Please revise." });
    }

    // Build comment data
    let display_name = "Anonymous";
    let avatar_url = null;
    let publicUserId = null;

    if (!is_anonymous) {
      const userDoc = await db().collection('users').doc(req.user.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        display_name = userData.name || (req.user.email ? req.user.email.split('@')[0] : "User");
        avatar_url = userData.avatar_url || userData.photoURL || null;
      } else {
        display_name = req.user.email ? req.user.email.split('@')[0] : "User";
      }
      publicUserId = req.user.uid;
    }

    const commentData = {
      post_id: postId,
      user_id: publicUserId,
      _internal_user_id: req.user.uid,
      display_name,
      avatar_url,
      comment_text: comment_text.trim(),
      is_anonymous: !!is_anonymous,
      created_at: FieldValue.serverTimestamp()
    };

    const docRef = await db().collection('community_comments').add(commentData);

    // Increment comment_count on the parent post
    await db().collection('community_posts').doc(postId).update({
      comment_count: FieldValue.increment(1)
    });

    res.json({
      id: docRef.id,
      ...sanitizeComment(commentData),
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// 6. DELETE /posts/:postId — Delete a post (self-delete or admin)
// ═══════════════════════════════════════════════════════════════════════════════
router.delete('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const postDoc = await db().collection('community_posts').doc(postId).get();

    if (!postDoc.exists) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = postDoc.data();

    // Owner check (via internal field) or admin
    if (post._internal_user_id !== req.user.uid) {
      // Check if admin
      const userDoc = await db().collection('users').doc(req.user.uid).get();
      const isAdmin = userDoc.exists && userDoc.data().role === 'admin';
      if (!isAdmin) {
        return res.status(403).json({ error: "You can only delete your own posts." });
      }
    }

    // Batch delete: comments, supports, and the post itself
    const batch = db().batch();

    const comments = await db().collection('community_comments').where('post_id', '==', postId).get();
    comments.docs.forEach(doc => batch.delete(doc.ref));

    const supports = await db().collection('community_post_supports').where('post_id', '==', postId).get();
    supports.docs.forEach(doc => batch.delete(doc.ref));

    batch.delete(db().collection('community_posts').doc(postId));

    await batch.commit();

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// 7. POST /posts/:postId/report — Report a post
// ═══════════════════════════════════════════════════════════════════════════════
router.post('/posts/:postId/report', async (req, res) => {
  try {
    const { postId } = req.params;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ error: "A reason is required for reporting." });
    }

    // Check post exists
    const postDoc = await db().collection('community_posts').doc(postId).get();
    if (!postDoc.exists) {
      return res.status(404).json({ error: "Post not found" });
    }

    await db().collection('reported_posts').add({
      post_id: postId,
      reporter_user_id: req.user.uid,
      reason: reason.trim(),
      created_at: FieldValue.serverTimestamp(),
      status: 'pending'
    });

    res.json({ success: true, message: "Report submitted. Thank you for helping keep our community safe." });
  } catch (error) {
    console.error("Error reporting post:", error);
    res.status(500).json({ error: "Failed to report post" });
  }
});

module.exports = router;
