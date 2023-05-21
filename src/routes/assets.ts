import express from 'express';
import controller from '../controllers/assets';
const router = express.Router();

router.get('/init', controller.initLedger);
router.get('/all', controller.getAllAssets);
router.get('/create/energy/:amount', controller.createAsset);

export = router;