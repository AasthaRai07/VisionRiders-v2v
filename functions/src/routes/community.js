const express = require('express');
const admin = require('firebase-admin');

const router = express.Router();

router.get('/posts', async (req, res) => {
  try {
    const { category } = req.query;
    let query = admin.firestore().collection('community_posts')
      .orderBy('created_at', 'desc');
      
    if (category) {
      query = query.where('category', '==', category);
    }
    
    const snapshot = await query.get();
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.json({ posts });
  } catch (error) {
    console.error("Error fetching community posts:", error);
    res.status(500).json({ error: "Failed to fetch community posts" });
  }
});

router.post('/posts', async (req, res) => {
  try {
    const { category, post_text, is_anonymous } = req.body;
    
    // Default to user's name or anonymous
    let display_name = "Anonymous";
    if (!is_anonymous) {
      const userDoc = await admin.firestore().collection('users').doc(req.user.uid).get();
      if (userDoc.exists && userDoc.data().name) {
        display_name = userDoc.data().name;
      } else {
        // Fallback to token email name part
        display_name = req.user.email ? req.user.email.split('@')[0] : "User";
      }
    }
    
    const postData = {
      user_id: is_anonymous ? null : req.user.uid,
      display_name_or_anonymous: display_name,
      category: category || 'general',
      post_text,
      support_count: 0,
      comment_count: 0,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await admin.firestore().collection('community_posts').add(postData);
    
    res.json({ id: docRef.id, ...postData });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

router.post('/posts/:postId/support', async (req, res) => {
  try {
    const { postId } = req.params;
    
    const postRef = admin.firestore().collection('community_posts').doc(postId);
    await postRef.update({
      support_count: admin.firestore.FieldValue.increment(1)
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error supporting post:", error);
    res.status(500).json({ error: "Failed to support post" });
  }
});

router.post('/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment_text } = req.body;
    
    const commentData = {
      post_id: postId,
      user_id: req.user.uid,
      comment_text,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await admin.firestore().collection('community_comments').add(commentData);
    
    // Increment post comment count
    await admin.firestore().collection('community_posts').doc(postId).update({
      comment_count: admin.firestore.FieldValue.increment(1)
    });
    
    res.json({ success: true, comment: commentData });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

module.exports = router;
