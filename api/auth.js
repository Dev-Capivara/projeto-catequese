// api/auth.js
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    // Habilitar CORS para que seu HTML consiga acessar a API
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const sql = neon(process.env.DATABASE_URL);

    // ROTA DE LOGIN (POST)
    if (req.method === 'POST') {
        const { email, senha } = req.body;

        try {
            // Busca o usuário pelo e-mail
            const result = await sql`SELECT id, nome, email, senha, cargo FROM usuarios WHERE email = ${email} LIMIT 1`;

            if (result.length === 0) {
                return res.status(401).json({ error: 'Usuário não encontrado' });
            }

            const user = result[0];

            // Verificação simples de senha (em produção, use bcrypt)
            if (user.senha === senha) {
                // Remove a senha do objeto antes de enviar para o cliente por segurança
                delete user.senha;
                return res.status(200).json({ message: 'Login realizado com sucesso', user });
            } else {
                return res.status(401).json({ error: 'Senha incorreta' });
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro interno no servidor' });
        }
    }

    // ROTA DE LISTAGEM (Opcional - Apenas se precisar listar usuários)
    if (req.method === 'GET') {
        const result = await sql`SELECT id, nome, email, cargo FROM usuarios`;
        return res.status(200).json(result);
    }
}
