import express from 'express';
import { sql } from '../config/db.js';
import { getTransactionByUserId, createTransaction, deleteTransaction, getTransactionSummary } from '../controllers/transactionsController.js';

const router = express.Router();


router.post('/', createTransaction);

router.get('/:user_id', getTransactionByUserId);

router.delete('/:id', deleteTransaction )

router.get('/summary/:user_id', getTransactionSummary )


export default router;