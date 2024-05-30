const CustomUtils = require("../../utils");
const Post = require("../posts/postModel.js");

exports.UpdateSeveralPosts = async (req, res) => {
  let { limit, page, sort, fields, _start, _end } = req.query;
  const queryObj = CustomUtils.advancedQuery(req.query);
  // console.log(queryObj);
  try {
    if (_end && (_start || _start == 0)) {
      limit = _end - _start;
    }
    // const posts = await Post.find(queryObj)
    //   .limit(limit * 1)
    //   .skip(_start ? _start : 0)
    //   .sort({ dateAdded: -1, ...sort })
    //   .select(fields);
    // res.status(200).json(posts);

    const postsToBeModified = await Post.find({
      airMedia: {
        $eq: "All Africa News",
      },
    });

    const updated = await postsToBeModified.map(async (post) => {
      const oooooo = await Post.findByIdAndUpdate(
        post._id,
        {
          airLogo: "https://api.possible.africa/storage/logos/allafricacom.jpg",
        },
        { new: true }
      );
      console.log(oooooo)
      return oooooo;
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
