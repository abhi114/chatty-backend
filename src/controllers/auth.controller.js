import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
export const signup = async (req,res)=>{
    const {fullName,email,password} =  req.body
    try {
        //hash passwords
        if(password.length <6){
            return res.status(400).json({message:"Password must be at least 6 characters"})
        }
        const user = await User.findOne({email}) //if its already there
        if(user){
            return res.status(400).json({message:"Email already exists"});
            
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName:fullName,
            email:email,
            password:hashedPassword

        })
        if(newUser){
            //generate jwt token here
            generateToken(newUser._id,res)
            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                fullName: newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,
            })
        }else{
            res.status(400).json({message:"Invalid user Data"});
        }
    } catch (error) {
        console.log("error in signUp Controller " + error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
    res.send("signup route");
};
export const login = (req,res) =>{
    console.log("hi")
    res.send("login route");
};
export const logout = (req,res)=>{
    res.send("logout route");
};