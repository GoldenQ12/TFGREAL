import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
    const { fullName, email , password } = req.body;
    try {
        
        if (!fullName || !email || !password ) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        if (password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        const user = await User.findOne({email});

        if (user) return res.status(400).json({message: "Email already exists"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const emptyCollection = new Map();
        emptyCollection.set("movies", [{}]);
        emptyCollection.set("series", [{}]);
        emptyCollection.set("videogames", [{}]);
        emptyCollection.set("anime", [{}]);

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword,
            collections: emptyCollection,
            profilePic: "https://res.cloudinary.com/dxj8zq5h5/image/upload/v1698231266/DefaultProfilePic.png"
        });

        if ( newUser ) {

            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })

        } else{
            res.status(400).json({message: "Invalid user data"});
        }

    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({email});

        if (!user){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id:user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});        
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});        
    }
};

export const updateProfile = async ( req, res ) => {
   try {
        const { profilePic } = req.body;
        const userId = req.user._id;
        
        if (!profilePic){
            return res.status(400).json({message: "Profile pic is required"});
        }


        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(userId,  
            {profilePic:uploadResponse.secure_url}, 
            {new:true});

        res.status(200).json(updatedUser);



   } catch (error) {
    console.log("Error in update: ", error)
    res.status(500).json({message: "Internal Server Error"});
   }
}


export const checkAuth = (req, res ) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500),json({message: "Internal Server Error"});
    }
}

export const updateCollections = async (req, res) => {
    try {
        const { collectionType, entertainment } = req.body;
        const userId = req.user._id;


        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isInCollection = currentUser.collections.get(collectionType).some(item => 
            collectionType === "anime" ? item.mal_id === entertainment.mal_id : item.id === entertainment.id
        );
        console.log(isInCollection);
        if (!isInCollection) {
            currentUser.collections.get(collectionType).push(entertainment);
        } else {
            res.status(400).json({ message: "Ya existe" });
            return;
        }

        const updatedUser = await currentUser.save();

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in update: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteCollections = async (req, res) => {
    try {
        const { collectionType, entertainment } = req.body;
        const userId = req.user._id;


        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isInCollection = currentUser.collections.get(collectionType).some(item => item.id === entertainment.id);

        if (isInCollection) {
            currentUser.collections.get(collectionType).splice(currentUser.collections.get(collectionType).indexOf(entertainment), 1);
        } else {
            res.status(400).json({ message: collectionType + " not in collection" });
            return;
        }

        const updatedUser = await currentUser.save();

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in update: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
