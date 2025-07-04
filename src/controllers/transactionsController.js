import { sql } from "../config/db.js";


async function getTransactionByUserId(req, res) {
    try {
        const { user_id } = req.params;
        const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${user_id}`;
        if (transactions.length === 0) {
            return res.status(404).json({ error: 'No transactions found for this user' });
        }
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function createTransaction(req, res) {
    try {
        const { title, user_id, amount, category } = req.body;
        if (!title || !user_id || amount === undefined || !category) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        await sql`INSERT INTO transactions (user_id, title, amount, category) 
            VALUES (${user_id}, ${title}, ${amount}, ${category})`;
        res.status(201).json({ message: 'Transaction saved successfully' });
    } catch (error) {
        console.error('Error saving transaction:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function deleteTransaction(req, res) {
        try{
            const {id} = await req.params;
            if(isNaN(parseInt(id))) {
                return res.status(400).json({error: 'Invalid transaction ID'});
            }
    
            if (!id) {
                return res.status(400).json({error: 'User ID is required'});
            }
            const result = await sql`DELETE FROM transactions WHERE id = ${id}`;
            if (result.count === 0) {
                return res.status(404).json({error: 'Transaction not found or does not belong to this user'});
            }
            await res.status(200).json({message: 'Transaction deleted successfully'});
        }
        catch (error) {
            console.error('Error deleting transaction:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }

async function getTransactionSummary(req, res) {
    try{
        const {user_id} = req.params;
        if (!user_id) {
            return res.status(400).json({error: 'User ID is required'});
        }
        const balanceResult = await sql`SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${user_id} GROUP BY user_id`;
        const incomeResult = await sql`SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id = ${user_id} AND amount > 0 GROUP BY user_id`;
        const expenseResult = await sql`SELECT COALESCE(SUM(amount),0) as expense FROM transactions WHERE user_id = ${user_id} AND amount < 0 GROUP BY user_id`;

        res.status(200).json({
            balance: balanceResult[0]?.balance ?? 0,
            income: incomeResult[0]?.income ?? 0,
            expense: expenseResult[0]?.expense ?? 0
        });
    }
    catch (error) {
        console.error('Error fetching transaction summary:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}


export { getTransactionByUserId, createTransaction, deleteTransaction, getTransactionSummary };