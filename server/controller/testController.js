import { PrismaClient } from '@prisma/client';

// Initialise the prisma client 
// const prisma = new PrismaClient();


const firstTest = async (req, res) => {

    try {
        const {name}  = req.body; // get the name from the request body
        if (!name) {
            return res.status(400).json({ msg: " Sorry, name was not present" });
        }
        return res.status(200).json({name} );
    } catch (err) {
        console.log(err);
    }
}

export default { firstTest,};