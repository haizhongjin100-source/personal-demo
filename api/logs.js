const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
        return res.status(500).json({ error: '未配置 Supabase 环境变量' });
    }

    try {
        const limit = Math.min(parseInt(req.query.limit) || 50, 200);
        const url = `${SUPABASE_URL}/rest/v1/conversations?select=*&order=created_at.desc&limit=${limit}`;

        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
            }
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Supabase query error:', error);
            return res.status(500).json({ error: '查询失败' });
        }

        const data = await response.json();

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(data);
    } catch (error) {
        console.error('Logs Error:', error);
        return res.status(500).json({ error: '服务器错误' });
    }
};
