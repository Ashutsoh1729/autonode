```bash
GET /api/trpc/executions.getAll?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%7D%7D%7D 401 in 16ms (compile: 6ms, render: 10ms)
⨯ Error [TRPCClientError]: Unauthorized
    at ignore-listed frames {
  cause: undefined,
  shape: [Object],
  data: [Object],
  meta: [Object],
  digest: '971857337'
}
⨯ Error [TRPCClientError]: Unauthorized
    at ignore-listed frames {
  cause: undefined,
  shape: [Object],
  data: [Object],
  meta: [Object],
  digest: '971857337'
}
 GET /executions 500 in 1705ms (compile: 16ms, proxy.ts: 14ms, render: 1675ms)
 GET /api/auth/get-session 200 in 301ms (compile: 14ms, render: 287ms)
 GET /api/trpc/executions.getAll?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%7D%7D%7D 200 in 822ms (compile: 10ms, render: 812ms)
 PUT /api/inngest 200 in 25ms (compile: 3ms, rend


```
