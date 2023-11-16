import bcrypt from 'bcryptjs';
import { nanoid } from "nanoid";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

import ctrlWrapper from "../decorators/ctrlWrapper.js";
import User from "../models/userModel.js";
import HttpError from '../helpers/httpError.js';
import verificationEmail from '../helpers/sendEmail.js';

dotenv.config();
const { JWT_SECRET, DB_HOST } = process.env;

const getCurrent =(req, res) => {
    const { email, subscription } = req.user;
    if (!req.user) {
        throw HttpError(401)
    }
    res.json({
        email,
        subscription
        
    })
    
};

const register = async (req, res) => {
    let { email, password } = req.body;
    
    email = email.toLowerCase();

    const user = await User.findOne({ email });
    if (user) {
        throw HttpError (409, "Email in use")
    }
 
    const hashPassword = await bcrypt.hash(password, 10);
   
    const verificationToken = nanoid()

     verificationEmail(email, verificationToken)
   
    const newUser = await User.create({email, password: hashPassword, verificationToken });
    res.status(201).json({
        "user": {
            email: newUser.email,
            password: newUser.password,
            token:verificationToken
        }
      
    })
}

const login = async (req, res) => {
    let { email, password } = req.body;

    email = email.toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    };
    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    };
   
    const payload = {
        id: user.id,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
        token,
        "user": {
            email: user.email,
        }
    });
}

const google = async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findOne({ email });
  if (user) {
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    res.status(201).json({
      token,
      user: {
        email: user.email,
      },
    });
  }

  if (!user) {
    const user = await User.create({
      ...req.body,
      password: "google123",
    });
    const token = await createToken(user._id);
    res.status(201).json({
      token,
      user: {
        email,
      },
    });
  }
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token : "" });
    res.status(204).json("user");
}

const getCurrentUser = (req, res) => {
  const { email } = req.user;
  res.json({
    email,
  });
};

export default {
    getCurrent: ctrlWrapper(getCurrent),
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    google: ctrlWrapper(google),
    logout: ctrlWrapper(logout),
    getCurrentUser: ctrlWrapper(getCurrentUser)
}