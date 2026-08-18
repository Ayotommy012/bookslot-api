const express = require('express');
const {
    createResource, 
    listResources, 
    createSlot, 
    listSlotsForResource
} = require('../controllers/resourceController')
const {requireAuth, requireAdmin} = require('../middleware/auth')
const router = express.Router();

//Public
router.get('/', listResources);
router.get('/:resourceId/slots', listSlotsForResource);

//Admin only
router.post('/', requireAuth, requireAdmin, createResource);
router.post('/:resourceId/slots', requireAuth, requireAdmin, createSlot);


module.exports =  router;