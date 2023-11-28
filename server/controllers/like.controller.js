// import the user schema from model

const User = require("../model/User.model")


const likeAFact = async (req, res) => {
	try{
		//Get the user ID and the like object from the request body
		const { userId, likedFact } = req.body;

		const user = await User.findOne({ userId });

		// If the user doesn't exist, create a new user with the userID and the like object from the request body
		if (!user) {
		const newUser = new User({
				userId,
				likes: [
					likedFact
				]
		})
		await newUser.save()
		return res.status(200).json(newUser)
	}

		// If the user exists, check if the fact is already liked by the user
		let sameFact = user.likes.filter(fact => fact.text === likedFact.text)

		//If it's already liked, then return the user object.
    if (sameFact.length) {
      return res.status(200).json(user)
    }
    
		//Otherwise, save the like object and return the updated user object.
		user.likes.push(likedFact)
		await user.save();
		return res.status(200).json(user)

	} catch (error) {
			return res.status(500).json({ error: error.message })
		}
}

module.exports = { likeAFact };

