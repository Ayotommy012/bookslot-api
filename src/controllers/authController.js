const jwt = require('jsonwebtoken')
const {User} = require('../models')

function signToken(user) {
   return jwt.sign(
    {id:user.id, role:user.role},
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
    );
}

async function register(req, res){
    const {email,password} = req.body;
    if(!email || !password) {
        return res.status(400).json({ error: 'Email and password is required'});
    }
const existing = await User.findOne({where: { email }});
if (existing) return res.status(409).json({error: 'Email already in use'});

const newUser = await User.create({email, password_hash:password})
const token = signToken(newUser);

return res.status(201).json({ token, user: { id: newUser.id, email: newUser.email, role: newUser.role } });
}
async function login(req, res){
    const { email, password } = req.body;
    const foundUser = await User.findOne({ where: { email } });   
    if (!foundUser) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await foundUser.validatePlainPassword(password);
    if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = signToken(foundUser);
    return res.json({ token, user: { id: foundUser.id, email: foundUser.email, role: foundUser.role } });
}
module.exports = {register, login}