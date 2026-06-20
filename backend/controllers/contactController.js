const Contact =
  require("../models/Contact");

exports.createContact =
  async (req, res) => {
    try {

      const contact =
        await Contact.create(
          req.body
        );

      res.status(201).json({
        success: true,
        contact,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


  exports.getAllContacts =
  async (req, res) => {
    try {

      const contacts =
        await Contact.find()
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        contacts,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

  exports.deleteContact =
  async (req, res) => {
    try {

      await Contact.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        success: true,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };