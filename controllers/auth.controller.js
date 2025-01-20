const UserModel = require("../models/user.model");

const auth = async (req, res) => {
    try {
        // Ensure email exists in the request
        if (!req.body.email) {
            return res.status(400).json({ message: "Email is required", success: false });
        }

        const { email } = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            const token = await existingUser.generateAuthToken();

            // Set auth token cookie
            res.cookie("authToken", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000, // 1 day
                sameSite: "none",
                secure: true, // Ensure secure is true for HTTPS
            });

            return res.status(200).json({
                message: "User already exists",
                user: existingUser,
                success: true,
            });
        }

        const user = new UserModel(req.body);
        const token = await user.generateAuthToken();

        res.cookie("authToken", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            sameSite: "none",
            secure: true,

        });

        // Save the user to the database
        await user.save();

        return res.status(201).json({
            message: "User created successfully",
            user,
            success: true,
        });
    } catch (error) {
        console.error("Error in auth function:", error.message);

        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
            success: false,

        });
    }
};


const verifyUser = (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
        })
    }
    return res.status(200).json({
        message: "User verified successfully",
        user,
        success: true,
    })
}

const handleLogout = (req, res) => {
    // Clear the 'authToken' cookie
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });

    res.status(200).json({ message: 'Logout successful', success: true });
};

module.exports = {
    auth,
    handleLogout,
    verifyUser
};
