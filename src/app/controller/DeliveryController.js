import File from '../models/File';
import Recipients from '../models/Recipients';
import Deliveryman from '../models/Deliveryman';
import Deliveries from '../models/Deliveries';

class DeliveryController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const delivery = await Deliveries.findAll({
      where: {
        deliveryman_id: req.params.deliverymanId,
        canceled_at: null,
        end_date: null,
      },
      attributes: ['id', 'product', 'start_date', 'end_date'],
      limt: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
        {
          model: Recipients,
          as: 'recipients',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zip_code',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliverymans',
          attributes: ['id', 'name', 'email'],
          include: {
            model: File,
            as: 'avatar',
            attributes: ['id', 'path', 'url'],
          },
        },
      ],
    });

    return res.json(delivery);
  }
}

export default new DeliveryController();
