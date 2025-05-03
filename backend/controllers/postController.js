import Post from "../models/Post.js";

export const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content || !category)
      return res.status(400).json({ message: "Invalid Credentials" });

    const post = await Post.create({
      title,
      content,
      category,
      user: req.user._id,
    });

    return res
      .status(201)
      .json({ success: true, message: "Post created successfully", data:post });
  } catch (error) {
    console.log("Error in createPosts controller: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({createdAt: -1})
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.log("Error in getAllPosts controller: ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts. Please try again later.",
    });
  }
};

export const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({ user: req.user._id, _id: id })
      .populate("user", "name role")
      .populate("comments", "content");

    if(!post) return res.status(404).json({success: false, message: "Post not found."})
    
    return res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.log("Error in getSinglePost: ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts. Please try again later.",
    });
  }
};

// update post
export const updatePost = async(req, res) => {
  try {
    const {title, content, category} = req.body;
    if(!title || !content || !category) return res.status(400).json({success: false, message: "Invalid Credentials"})
    const {id} = req.params;
    const post = await Post.findOne({user: req.user._id, _id: id});
    
    if(!post) return res.status(404).json({success: false, message: "Post not found"})

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
  
    await post.save();
    await post.populate('user', 'name email role');
    return res.status(200).json({success: true, data: post});
    
  } catch (error) {
    console.log("Error in UpdatePost Controller: ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to Update posts. Please try again later.",
    });
  }
}

export const deletePost = async(req, res) => {
  try {
    const {id} = req.params;
    if(!req.user?._id) return res.status(401).json({success:false, message: "Unauthorized"})

    //1. Find the post
    const post = await Post.findById({user: req.user._id, _id: id});
    if(!post) return res.status(404).json({success: false, message: "Post not found"})

    //2. check if the user is either the author or an admin
    const isAuthor = post.user.toString() === req.user._id;
    const isAdmin = req.user.role === "admin";

    if(!isAuthor && !isAdmin) {
      return res.status(403).json({message: "Unauthorized: You cannot delete this post"});
    }

    // delete the post
    await post.deleteOne();

    return res.status(200).json({success: true, message: "Post deleted successfully"});
  } catch (error) {
    console.log("Error in deletePost Controller: ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete post. Please try again later.",
    });
  }
}

export const toggleLike = async(req, res) => {
  try {
    const {postId} = req.params;
    const userId = req.user._id;

    const post = await Post.findById({_id: postId, user: userId})
    if(!post) return res.status(404).json({success: false, message: "Post not found"});

    //checks if the user's ID is already in the likes[] array
    const alreadyLiked = post.likes.includes(userId);
    if(alreadyLiked) {
      //unlike
      post.likes.pull(userId);
      await post.save();
      return res.status(200).json({success: true, message: "Post unliked", likesCount: post.likes.length});
    } else {
      // like
      post.likes.push(userId);
      await post.save();
      return res.status(200).json({success: true, message: "Post Liked", likesCount: post.likes.length});
    }
  } catch (error) {
    console.log("Error toggleLike controller: ", error);
    return res.status(500).json({success: false, message: "Internal Server Error"})
  }
}