const {
    searchUsers,
    getUserById,
    enrichUser,
} = require("../services/usersStore");

async function searchUsersHandler(req, res) {
    const { q, company, school, role, city } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const currentUserId = req.headers["x-current-user-id"] || req.query.currentUserId || null;

    try {
        const results = await searchUsers({ q, company, school, role, city });
        const matches = results.filter((u) => u.id !== currentUserId);

        const enrichedMatches = await Promise.all(matches.map((u) => enrichUser(u, currentUserId)));

        const visible = enrichedMatches.filter((u) => !u.connected);
        const total = visible.length;
        const totalPages = Math.ceil(total / limit);
        const offset = (page - 1) * limit;
        const enriched = visible.slice(offset, offset + limit);

        res.json({
            data: enriched,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        });
    } catch (err) {
        console.error("[searchUsers]", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

async function getUserProfileHandler(req, res) {
    const { id } = req.params;
    const currentUserId = req.headers["x-current-user-id"] || req.query.currentUserId || null;

    try {
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const enriched = await enrichUser(user, currentUserId);
        res.json({ data: enriched });
    } catch (err) {
        console.error("[getUserProfile]", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    searchUsersHandler,
    getUserProfileHandler,
};