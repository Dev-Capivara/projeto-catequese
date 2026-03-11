// api/presenca.js
import sql from './db.js';

export default async function handler(req, res) {
    // Configuração de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // SALVAR PRESENÇA (POST)
    if (req.method === 'POST') {
        const { turma_id, data, lista } = req.body; 
        // 'lista' esperado: [{ aluno_id: 1, status: 'P' }, ...]

        try {
            // Usamos uma transação ou múltiplos inserts
            for (const item of lista) {
                await sql`
                    INSERT INTO presencas (catequizando_id, turma_id, data, status)
                    VALUES (${item.aluno_id}, ${turma_id}, ${data}, ${item.status})
                    ON CONFLICT (catequizando_id, data) 
                    DO UPDATE SET status = EXCLUDED.status
                `;
            }
            return res.status(200).json({ message: 'Presenças registradas com sucesso!' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao salvar no banco' });
        }
    }

    // CONSULTAR PRESENÇA (GET)
    if (req.method === 'GET') {
        const { turma_id } = req.query;
        const result = await sql`SELECT * FROM presencas WHERE turma_id = ${turma_id}`;
        return res.status(200).json(result);
    }
}
