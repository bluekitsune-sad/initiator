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
    console.log('Vicidial login POST to:', url)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        body: body.toString(),
      })

      console.log('Vicidial response status:', response.status)

      const headers = new Headers()
      headers.set('Content-Type', 'text/html; charset=utf-8')
      headers.set('Access-Control-Allow-Origin', '*')
      headers.set('Access-Control-Allow-Credentials', 'true')

      const setCookie = response.headers.get('set-cookie')
      if (setCookie) {
        console.log('Set-Cookie received')
        headers.set('Set-Cookie', setCookie)
      }

      const text = await response.text()
      console.log('Vicidial response length:', text.length)

      clearTimeout(timeout)
      return new NextResponse(text, {
        status: response.status,
        headers,
      })
    } catch (fetchError: any) {
      clearTimeout(timeout)
      console.error('Fetch error:', fetchError.message)
      
      // Return a more helpful error
      return NextResponse.json({
        error: 'Cannot connect to VICIdial server',
        details: fetchError.message,
        hint: 'Check if dialer.synapselabs.us is accessible from the server',
        url: url
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

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const vicidialUrl = `${VICIDIAL_URL}/agc/vicidial.php?${url.searchParams.toString()}`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch(vicidialUrl, {
        method: 'GET',
        credentials: 'include',
        signal: controller.signal,
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      })

      const headers = new Headers()
      headers.set('Content-Type', 'text/html; charset=utf-8')
      headers.set('Access-Control-Allow-Origin', '*')
      headers.set('Access-Control-Allow-Credentials', 'true')

      const setCookie = response.headers.get('set-cookie')
      if (setCookie) {
        headers.set('Set-Cookie', setCookie)
      }

      const text = await response.text()
      clearTimeout(timeout)

      return new NextResponse(text, {
        status: response.status,
        headers,
      })
    } catch (fetchError: any) {
      clearTimeout(timeout)
      console.error('Fetch error:', fetchError.message)
      return NextResponse.json({
        error: 'Cannot connect to VICIdial server',
        details: fetchError.message
      }, { status: 502 })
    }
  } catch (error) {
    console.error('Vicidial GET error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Request failed' },
      { status: 500 }
    )
  }
}
