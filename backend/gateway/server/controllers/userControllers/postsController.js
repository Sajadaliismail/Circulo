const path = require("path");
const fs = require("fs");
const Post = require("../../Database/MongoDb/postsSchema");
const cloudinary = require("../../services/cloudinary");

const addPost = async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  try {
   const { post } = req.body;
    const fileName = req.file?.filename; 
    let imageUrl = '';
    const userId = req.userId;
    console.log(fileName);

    if (fileName) {
      const filePath = path.join("assets/imgs/uploads/", fileName);
      const result = await cloudinary.uploader.upload(filePath);
      imageUrl = result.secure_url;
      console.log(result,'asd');

     fs.unlinkSync(filePath);
    }
  
    const userPost = new Post({
      content: post,
      author: userId,
      image: imageUrl
    });

    await userPost.save();
    return res.status(200).json({ message: 'Post created successfully' });
  } catch (error) {
    console.log(error);
    return res.status(404)
  }
};


const fetchposts = async (req,res)=>{
    try {
        const posts = await Post.find().sort({createdAt:-1})
        console.log(posts);
        return res.status(200).json({posts:posts})
    } catch (error) {
        console.log(error);
    }
}
module.exports = { addPost,fetchposts };
