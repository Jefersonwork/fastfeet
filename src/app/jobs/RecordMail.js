import Mail from '../../lib/Mail';

class RecordMail {
  get key() {
    return 'RecordMail';
  }

  async handle({ data }) {
    const { product, deliveryman } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Encomenda cadastrada',
      template: 'Record',
      context: {
        provider: deliveryman.name,
        product,
      },
    });
  }
}

export default new RecordMail();
