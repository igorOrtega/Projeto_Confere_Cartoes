module.exports = app => {
    const save = (req, res) => {
        res.send('transaction saved')
    }

    return  {save}
}