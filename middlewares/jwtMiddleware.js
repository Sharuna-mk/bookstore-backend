const jwt = require('jsonwebtoken')

const jwtMiddleware = (req,res,next)=>{
    console.log("inside jwt middleware");
    console.log(req.headers.authorization.slice(7));
    const token = req.headers.authorization.slice(7);
    try {
        const jwtVerification = jwt.verify(token,process.env.jwtkey)
        console.log(jwtVerification);
        req.payload = jwtVerification.userMail
        next()
        

    } catch (error) {
      res.status(402).json("Authorization failed"+ error)
       
    }

   
    
}

module.exports = jwtMiddleware