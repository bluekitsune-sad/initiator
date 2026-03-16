import { NextRequest, NextResponse } from 'next/server'

const VICIDIAL_URL = process.env.VICIDIAL_URL || 'https://dialer.synapselabs.us'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const body = new URLSearchParams()

    formData.forEach((value, key) => {
      body.append(key, value.toString())
    })

    const url = `${VICIDIAL_URL}/agc/vicidial.php`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'text/html,application/xhtml+xml',
        },
        body: body.toString(),
      })

      clearTimeout(timeout)

      const headers = new Headers()
      headers.set('Content-Type', 'text/html; charset=utf-8')
      headers.set('Access-Control-Allow-Origin', '*')
      headers.set('Access-Control-Allow-Credentials', 'true')

      const setCookie = response.headers.get('set-cookie')
      if (setCookie) {
        headers.set('Set-Cookie', setCookie)
      }

      const text = await response.text()

      return new NextResponse(text, {
        status: response.status,
        headers,
      })
    } catch (fetchError: any) {
      clearTimeout(timeout)
      console.error('Login fetch error:', fetchError.message)
      
      return NextResponse.json({
        error: 'Cannot connect to VICIdial server',
        details: fetchError.message,
        vicidial_url: VICIDIAL_URL,
        hint: 'Check firewall settings on VICIdial server to allow external connections'
      }, { status: 502 })
    }
  } catch (error) {
    console.error('Vicidial login error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 500 }
    )
  }
}
