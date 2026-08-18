const { Resource, Slot } = require('../models');

async function createResource(req, res) {
  const { name, description, category } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });

  const resource = await Resource.create({ name, description, category });
  return res.status(201).json(resource);
}

async function listResources(req, res) {
    const resource = await Resource.findAll();
    return res.json(resource)
}
async function createSlot(req,res){
    const {resourceId} = req.params;
    const {start_time, end_time, capacity} = req.body;

    const resource = await Resource.findByPk(resourceId);
    if(!resource) return res.status(404).json({error:'resource not found'});

    try{
      const slot = await Slot.create({
        start_time,
        end_time,
        capacity,
        ResourceId:resource.id
        }) 
        return res.status(201).json(slot);
    }catch(err){
        return res.status(400).json({error:err.message});
    }
}
async function listSlotsForResource(req, res) {
    const { resourceId } = req.params;
    const slots = await Slot.findAll({
        where: { ResourceId: resourceId, status: ['open', 'full'] },
        order: [['start_time', 'ASC']],
    });
    return res.json(slots);
}

module.exports = { createResource, listResources, createSlot, listSlotsForResource };
