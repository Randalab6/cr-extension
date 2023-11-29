// import the user schema from model
const User = require("../model/User.model")

exports.getAUser = async (req, res) => {
	try {
			// Get the user ID from the request parameter.
			const { userId } = req.params;

			// Find the user with the given user ID from the database.
			const user = await User.findOne({ userId });

			// Return the user if found.
			return res.status(200).json(user);
	} catch (error) {
			return res.status(500).json({ error: error.message });
	}
};

exports.likeAFact = async (req, res) => {
	try {
			// Get the user ID and the like object from the request body
			const { userId, likedFact } = req.body;

			// Find the user by userId, create a new one if it doesn't exist
			const user = await User.findOne({ userId });
			if (!user) {
					const newUser = new User({
							userId,
							likes: [likedFact]
					});
					await newUser.save();
					return res.status(200).json(newUser);
			}

			// Check if the fact is already liked by the user
			let sameFact = user.likes.filter(fact => fact.text === likedFact.text);

			// If already liked, return the user object
			if (sameFact.length) {
					return res.status(200).json(user);
			}

			// Otherwise, save the like object and return the updated user object
			user.likes.push(likedFact);
			await user.save();
			return res.status(200).json(user);

	} catch (error) {
			return res.status(500).json({ error: error.message });
	}
};



