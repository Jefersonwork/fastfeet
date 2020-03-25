import * as Yup from 'yup';
import File from '../models/File';
import Recipients from '../models/Recipients';
import Deliveryman from '../models/Deliveryman';
import Deliveries from '../models/Deliveries';

class DeliveriesController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveries = await Deliveries.findAll({
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

    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.string().required(),
      deliveryman_id: Yup.string().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    const recipientExists = await Recipients.findOne({
      where: { id: recipient_id },
    });

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipent not exists.' });
    }

    const deliverymanExists = await Deliveryman.findOne({
      where: { id: deliveryman_id },
    });

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman not exists.' });
    }

    const { id, product } = await Deliveries.create(req.body);

    return res.json({ id, recipient_id, deliveryman_id, product });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { recipient_id, deliveryman_id, id } = req.body;

    const deliveryExists = await Deliveries.findOne({ where: { id } });

    const delivery = await Deliveries.findByPk(req.userId);

    if (!deliveryExists) {
      return res.status(400).json({ error: 'Delivery already exists.' });
    }

    if (recipient_id) {
      const recipientExists = await Recipients.findOne({
        where: { id: recipient_id },
      });

      if (!recipientExists) {
        return res.status(400).json({ error: 'Recipent not exists.' });
      }
    }

    if (deliveryman_id) {
      const deliverymanExists = await Deliveryman.findOne({
        where: { id: deliveryman_id },
      });

      if (!deliverymanExists) {
        return res.status(400).json({ error: 'Deliveryman not exists.' });
      }
    }

    const { product } = await delivery.update(req.body);

    return res.json({
      id,
      product,
      recipient_id,
      deliveryman_id,
    });
  }

  async delete(req, res) {
    const deliveries = await Deliveries.findByPk(req.params.id);

    if (!deliveries) {
      return res.status(400).json({ error: 'Delivery id not find' });
    }

    await Deliveries.destroy({
      where: {
        id: deliveries.id,
      },
    });

    return res.json({ deliveries });
  }
}

export default new DeliveriesController();
