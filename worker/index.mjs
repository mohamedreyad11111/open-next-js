import bcrypt from "bcryptjs";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname === '/api/register' && request.method === 'POST') {
      const { username, password } = await request.json();
      const hashed = await bcrypt.hash(password, 10);
      await env.DB.prepare('INSERT INTO users (username, password) VALUES (?, ?)')
        .bind(username, hashed).run();
      return new Response("Registered", { status: 200 });
    }

    if (pathname === '/api/login' && request.method === 'POST') {
      const { username, password } = await request.json();
      const result = await env.DB.prepare('SELECT * FROM users WHERE username = ?')
        .bind(username).first();
      if (!result) return new Response("User not found", { status: 404 });

      const match = await bcrypt.compare(password, result.password);
      if (!match) return new Response("Invalid credentials", { status: 401 });

      return new Response("Logged in", { status: 200 });
    }

    if (pathname === '/api/messages') {
      if (request.method === 'POST') {
        const { content } = await request.json();
        await env.DB.prepare('INSERT INTO messages (user_id, content) VALUES (?, ?)')
          .bind(1, content).run(); // simplified: assumes user_id = 1
        return new Response("Message sent", { status: 200 });
      }

      if (request.method === 'GET') {
        const messages = await env.DB.prepare('SELECT id, content FROM messages ORDER BY created_at DESC LIMIT 10').all();
        return Response.json(messages.results);
      }
    }

    return new Response("Not found", { status: 404 });
  },
};
