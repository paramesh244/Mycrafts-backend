const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin  = require('../middleware/requireLogin')
const Post =  mongoose.model("Post")


router.get('/allpost',requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name city address")
    .populate("comments.postedBy","_id name")

    .sort('-createdAt')
    .then((posts)=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err)
    })
    
})

router.get('/getsubpost',requireLogin,(req,res)=>{

    // if postedBy in following
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name city address")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/getlikedpost',requireLogin,(req,res)=>{

    
    Post.find({likes:{$in:req.user._id}})
    .populate("postedBy","_id name city address")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,price,pic} = req.body 
    if(!title || !body || !pic || !price){
      return  res.status(422).json({error:"Plase add all the fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        price,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("PostedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    })
    .populate("likes.postedBy","_id name city address")
    .populate("postedBy","_id name city address")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })

})
router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("likes.postedBy","_id name city address")
    .populate("postedBy","_id name city address")
    
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})


router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name city address")
    .populate("postedBy","_id name city address")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})



router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
              post.remove()
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})

//post delete by admin
router.delete('/deletepostadmin/:id',requireLogin,async(req,res)=>{
    // Post.findOne({_id:req.params.postId})
   
    try {
        console.log(req.params.id)
        let post = await Post.findByIdAndDelete(req.params.id)

    //  let post = await Post.remove(req.params.id)
    
     console.log(post,"post deleted");
    
      res.send(post)
    } catch (error) {
      console.log('error occured while deleting a post', error)
    }
})

router.put('/report',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{reports:req.user._id}
    },{
        new:true
    })
    .populate("reports.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
console.log("post reported")
})

//remove report
router.put('/removereport',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{reports:req.user._id}
    },{
        new:true
    })
    .populate("reports.postedBy","_id name")
    .populate("postedBy","_id name")
    
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
    console.log("report removed")
})


//search post

router.post('/search-post',(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    Post.find({title:{$regex:userPattern}})
    .select("_id title")
    .then(post=>{
        res.json({post})
    }).catch(err=>{
        console.log(err)
    })

})

router.get('/reported',requireLogin,(req,res)=>{
    Post.find( { $where: "this.reports.length > 0" })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")

    .sort('-createdAt')
    .then((posts)=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err)
    })
    
})




module.exports = router