import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (content.length === 0)
      return res
        .status(403)
        .json({ success: false, message: "Comment is empty!" });

    const comment = await Comment.create({
      user: req.user._id,
      post: postId,
      content,
    });
    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    return res.status(201).json({ success: true, data: comment });
  } catch (error) {
    console.log("Error in addComment: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    //step 1: Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const post = await Post.findById(comment.post);
    if(!post) return res.status(404).json({message: "Post not found"})

    //step2: Check authorization (only comment owner or admin can delete)
    const isCommentAuthor = comment.user.toString() === req.user.id;
    const isPostOwner = post.user.toString() === req.user.id;
    const isAdmin = req.user.role = "admin";
    
    if (!isCommentAuthor && !isPostOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    //step3: Delete the comment
    await comment.deleteOne();

    //step4: Remove comment reference from Post.comments[]
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    });

    return res
      .status(200)
      .json({ success: true, message: "Comment deleted successfully!" });
  } catch (error) {
    console.log("Error in deleteComment controller: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { commentId } = req.params;

    if (!content)
      return res
        .status(403)
        .json({ success: false, message: "empty comment cannot be updated!" });

    // findByIdAndUpdate expects just an ID, not a filter object.
    // Use findOneAndUpdate() instead if you want to match both fields.
    // new: true, ensures you get the updated comment in response
    const comment = await Comment.findOneAndUpdate(
      { _id: commentId, user: req.user._id },
      { content: content },
      {new: true}
    );
    if (!comment)
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized or comment not found",
        });

    return res.status(200).json({ success: true, data: comment });
  } catch (error) {
    console.log("Error in updateComment controller: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
