const {
    searchUsers,
    getUserById,
    enrichUser,
} = require("../services/usersStore");

function searchUsersHandler(req, res) {
    const { q, company, school, role, city } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const currentUserId = req.headers["x-current-user-id"] || req.query.currentUserId || null;

    try {
        const matches = searchUsers({ q, company, school, role, city })
            .filter((u) => u.id !== currentUserId);
        Promise.all(matches.map((u) => enrichUser(u, currentUserId)))
            .then((enrichedMatches) => {
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
            })
            .catch((err) => {
                console.error("[searchUsers]", err);
                res.status(500).json({ error: "Internal server error" });
            });
    } catch (err) {
        console.error("[searchUsers]", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

async function getUserProfileHandler(req, res) {
  const { id } = req.params;
  const currentUserId = req.headers["x-current-user-id"] || req.query.currentUserId || null;

  const user = getUserById(id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

    const enriched = await enrichUser(user, currentUserId);
    res.json({ data: enriched });
}

module.exports = {
  searchUsersHandler,
  getUserProfileHandler,
};