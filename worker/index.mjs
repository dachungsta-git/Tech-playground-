const reply = (body, status = 200) => Response.json(body, {status, headers:{"Cache-Control":"no-store", "X-Content-Type-Options":"nosniff"}});

async function readLimited(request, max) {
  if (!request.body) return "";
  const reader = request.body.getReader(), chunks = [];
  let size = 0;
  for (;;) {
    const {value,done} = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel();
      throw new Error("Body too large");
    }
    chunks.push(value);
  }
  const decoder = new TextDecoder("utf-8",{fatal:true});
  return chunks.map(chunk=>decoder.decode(chunk,{stream:true})).join("") + decoder.decode();
}

export function makeWorker(assets) {
  return {async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/suggestions") {
      if (request.method !== "POST") return reply({ok:false},405);
      if (!request.headers.get("content-type")?.startsWith("application/json")) return reply({ok:false},415);
      const origin = request.headers.get("origin");
      if (origin !== null && origin !== url.origin) return reply({ok:false},403);
      let topic;
      try {
        const payload = JSON.parse(await readLimited(request, 768));
        topic = typeof payload?.topic === "string" ? payload.topic.normalize("NFKC").toLowerCase().trim().replace(/\s+/g," ") : "";
      } catch { return reply({ok:false},400); }
      if (topic.length < 2 || topic.length > 80 || !/[\p{L}]/u.test(topic) ||
          !/^[\p{L}\p{M}\p{N} &+()'’.,-]+$/u.test(topic) || /\d{7,}|(?:^|\s)(?:www\.|https?\b)/i.test(topic)) return reply({ok:false},400);
      try {
        await env.DB.prepare("INSERT INTO demo_suggestions (topic, request_count, last_requested_at) VALUES (?, 1, ?) ON CONFLICT(topic) DO UPDATE SET request_count = request_count + 1, last_requested_at = excluded.last_requested_at")
          .bind(topic, new Date().toISOString()).run();
      } catch { return reply({ok:false},503); }
      return reply({ok:true},201);
    }
    const path = url.pathname === "/index.html" ? "/" : url.pathname;
    if (!(request.method === "GET" || request.method === "HEAD") || !Object.hasOwn(assets,path)) return new Response("Not found",{status:404});
    const {content,type}=assets[path];
    return new Response(request.method === "HEAD" ? null : content,{headers:{"Content-Type":type, "Cache-Control":"no-cache", "X-Content-Type-Options":"nosniff"}});
  }};
}
