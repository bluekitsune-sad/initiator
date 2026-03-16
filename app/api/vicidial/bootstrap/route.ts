import { NextRequest, NextResponse } from 'next/server'

const AGENT_USER = process.env.AGENT_USER || '2416'
const AGENT_PASS = process.env.AGENT_PASS || 'UZ2A1R420243'
const PHONE_LOGIN = process.env.PHONE_LOGIN || '2416'
const PHONE_PASS = process.env.PHONE_PASS || 'UZ2A1R420243'
const CAMPAIGN = process.env.CAMPAIGN || 'INBRETEN'

function esc(value: string) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export async function GET(req: NextRequest) {
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>VICIdial Auto Login</title>
  </head>
  <body onload="document.forms[0].submit()">
    <form method="POST" action="/api/vicidial/login">
      <input type="hidden" name="VD_login" value="${esc(AGENT_USER)}" />
      <input type="hidden" name="VD_pass" value="${esc(AGENT_PASS)}" />
      <input type="hidden" name="VD_campaign" value="${esc(CAMPAIGN)}" />
      <input type="hidden" name="phone_login" value="${esc(PHONE_LOGIN)}" />
      <input type="hidden" name="phone_pass" value="${esc(PHONE_PASS)}" />
      <input type="hidden" name="relogin" value="YES" />
    </form>
  </body>
</html>`

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
