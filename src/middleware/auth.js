const jwt = require('jsonwebtoken');

function requireAuth(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({error:'Missing or malformed token'});
    }
    const token = authHeader.split(' ')[1];
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = payload;
            next();
        } catch (error) {
        return res.status(401).json({error:'Invalid or expired token'});

        }
}

function requireAdmin(req, res, next){
    if (req.user?.role !== 'admin'){
        return res.status(403).json({error:'Admin access is required'});
    }
    next();
}

module.exports = {requireAuth, requireAdmin}    
