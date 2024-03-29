//imports
const User = require("../models/user.model");
const sendEmail = require("../utils/sendMail");
const sendToken = require("../utils/SendToken")


// Register
exports.RegisterUser = async (req, res) => {
  try {
    const { Name, Email, Password, ContactNumber, Role } = req.body;

    // Validate if no any empty field
    if (!Name || !Email || !Password || !ContactNumber) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ Email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email address is already registered',
      });
    }
   const existingUserByContactNumber = await User.findOne({ ContactNumber });
    if (existingUserByContactNumber) {
      return res.status(409).json({
        success: false,
        message: 'Contact number is already registered',
      });
    }
    // Save a new user
    const newUser = new User({
      Name,
      Email,
      Password,
      ContactNumber,
      Role,
    });

    const emailOptions = {
      email: Email,
      subject: 'Welcome To Ecommerce Project',
      message: `Congratulations Buddy ${Name}`,
    };
    


    // Save the new user to the database
    await newUser.save();
    // Send welcome email
    await sendEmail(emailOptions);
    return res.status(200).json({
      success: true,
      data: newUser,
      message: 'Registration successful',
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};


//Login 
exports.LogginUser = async (req,res) =>{
    try {
        
        const {Email , Password} = req.body

        if(!Email || !Password){
            return res.status(403).json({
                success: false,
                message: "Please enter all fields"
            })
        }
      const checkUser = await User.findOne({Email})

      if(!checkUser){
        return res.status(401).json({
            success: false,
            message: "User Not Found"
        })
    }

    const PasswordMatch = await checkUser.comparePassword(Password)
    if (!PasswordMatch) {
      return res.status(401).json({
        succes:false,
        message:"Invalid Password"
      })
    }   
    
    await sendToken(checkUser, res, 200);
    } catch (error) {
        console.log(error)
    }
}


//Logout

exports.LogoutUser = async (req,res) =>{
  //clear cookie
  try {
    res.cookie('Token')
    // console.log('LogoutUser')

    return res.status(200).json({
      success: true,
      message:'Logged out'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:'Internal Server Error'
    })
  }
}


exports.getUserIdbyUser = async(req,res)=>{
  try{
    let userid= req.params.user_id;
    let UserInfo = await User.findById(userid,-"password");
    if(!UserInfo){
      return res.status(403).json({
        success: false,
        msg: 'user is not found'
      })
    }
    
   

    return res.status(200).json({
      success: true,
      msg: 'user is found',
      data : UserInfo
    })


  }
  catch(error){
    console.log(error)
  }
}