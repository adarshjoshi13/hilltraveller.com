const jwt = require('jsonwebtoken');
const Admin = require('../modals/Admin')
const bcrypt = require('bcrypt');
const CreateAdminControler = async (req, res) => {
    try {
      const { username, password,Role } = req.body;
      console.log(req.body)
    //   const hassedpassword = await bcrypt.hash(password,10);
      const usercreated = await Admin.create({
        username,
        password,
       Role,
      })
      
      res.status(200).json({usercreated})
    } catch (error) {
      
        // console.log(error)
      if(error.name === "ValidationError"){
        const validationErrors = Object.values(error.errors).map((val) => val.message);
        console.log(validationErrors)

        res.status(400).json({message:validationErrors[0]})
      }
      else if (error.code === 11000 || error.code === 11001) {
        const violatedKeys = Object.keys(error.keyPattern);
        console.log(violatedKeys)
        res.status(400).json({ message: `${violatedKeys[0]} already exists.` });
      }
      else{
        res.status(500).json({message:"internal server error"})
      }
    //   console.log('Error name:', error.name);
    // console.log('Error message:', error.message);
    // console.log('Error code:', error.code);
    // console.log(error.errors)

    // res.status(500).json({message:"try again"})
    }

  
 }


 const loginControler = async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    console.log(admin, req.body);
  
    if (!admin) {
      return res.status(404).json({ message: 'user  not found' });
    }
  
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'wrong password' });
    }
  
    const accessToken = jwt.sign({ adminId: admin._id }, process.env.ACCESS_TOKEN_SECRET);
    const refershToken = jwt.sign({adminId:admin._id},process.env.REFRESH_TOKEN_SECRET)

   try {
    const result = await Admin.updateOne({ _id: admin._id }, { $set: { refershToken: refershToken } });
   } catch (error) {
      console.log(error)
      res.json({message:"internal server error",}).status(500)
   }
    
    res.cookie('token', accessToken, {
      httpOnly: true,
    });

    res.cookie('refresh-token',refershToken,{
      httpOnly:true,
    })
  
    return res.json({message:"succesfuly login",token:accessToken,refershToken,}).status(200)
  }
 module.exports = {CreateAdminControler,loginControler};