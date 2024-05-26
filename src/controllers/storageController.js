export const uploadFile = async (req, res, next) => {
    try {
        res.json({ filename: req.file.filename});
    } catch (err) {
        res.sendStatus(400);
    }
}