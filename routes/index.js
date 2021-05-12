const express = require('express');
const router = express.Router();
const responseController = require('../utility/responseHandler/responseController');
router.get('/', (req,res) => {
    let response = {
        rows: [{
            isexecuted: true,
            errorcode: 'E0000',
            user: req.user
        }]
    };
    responseController.getfinalresult(null,response,req,res);
})

module.exports = router;

