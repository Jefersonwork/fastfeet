import { Op } from 'sequelize';
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

  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }

  async update(req, res) {
    const deliveryman = Deliveryman.findByPk(req.deliverymanId);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Delyveryman does not exists' });
    }

    const delivery = await Deliveries.findByPk(req.body.id);

    const { start_date } = req.body;

    if (start_date) {
      const time = new Date();
      const hour = time.toLocaleTimeString();

      const startHour = '08:00';
      const endHour = '23:59';

      if (hour < startHour || hour > endHour) {
        return res
          .status(400)
          .json({ error: 'Appointment hour is not available' });
      }

      const date = time.toLocaleDateString();

      const myDeliveries = await Deliveries.findAll({
        where: {
          deliveryman_id: req.params.deliverymanId,
          canceled_at: null,
          start_date: {
            [Op.not]: null,
          },
          end_date: null,
        },
        attributes: ['start_date'],
      });

      const withdrawals = [];

      myDeliveries.map(item => {
        const day = item.start_date.toLocaleDateString();

        if (day === date) {
          withdrawals.push(day);
        }

        return day;
      });

      if (withdrawals.length > 4) {
        return res.status(400).json({ error: 'daily limit reached' });
      }
    }

    delivery.update(req.body);

    return res.json(req.body);
  }
}

export default new DeliveryController();
