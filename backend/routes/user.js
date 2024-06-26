import express from "express";
import { Account, User } from "../db.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import zod from 'zod';
import { authMiddleware } from "../middleware.js";

const router = express.Router();

const signUpBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(), 
    password : zod.string()
})

router.post("/signup", async (req, res) => {
    const { success } = signUpBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })

    const userId = user._id;

    // create new account -->
    await Account.create({
        userId,
        balance: 1 + Math.random() * 1e4
    })

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.status(200).json({
        message: "User created successfully",
        token: token
    })
});

const signInBody = zod.object({
    username: zod.string().email(),
    password: zod.string().min(8)   
})

router.post("/signin", async (req, res) => {
    const { success } = signInBody.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            message : "Incorrect Inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
        
        res.status(200).json({
            token: token
        })
        return;
    }

    res.status(411).json({
        message: "Error while loggin in"
    })
}) 


const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }
    await User.updateOne(req.body, {
        _id: req.userId
    })

    res.status(200).json({
        message: "Updated successfully"
    })
});


router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.status(200).json({
        user: users.map(user => ({
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })

});


router.get("/me",authMiddleware, async (req, res) => {


    const account = await Account.findOne({
        userId: "6650408e29f94cacc5d502f9"
    })
    const user = await User.findOne({
        _id: req.userId
    })


      
    res.status(200).json({
        account,
        user,
        // firstName: req.userId,
        // balance : account.balance,
        message : "checking"
        
    })

})

export default router;






