const jwt = require('jsonwebtoken')

const adminJwtMiddleware = (req,res,next)=>{
  console.log("inside adminJwtMiddleware");
   console.log(req.headers.authorization.slice(7));
      const token = req.headers.authorization.slice(7);
      try {
          const jwtVerification = jwt.verify(token,process.env.jwtkey)
          console.log(jwtVerification);
          req.payload = jwtVerification.userMail
          req.role = jwtVerification.role
          if(jwtVerification.role == 'Admin'){
          next()
          }
          else{
            res.status(403).json("Authorization failed... Only for Admin")
          }
  
      } catch (error) {
        res.status(402).json("Authorization failed"+ error)
         
      }
   
      
  }
  

module.exports = adminJwtMiddleware