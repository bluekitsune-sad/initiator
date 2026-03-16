import { NextRequest, NextResponse } from 'next/server'

const VICIDIAL_URL = process.env.VICIDIAL_URL || 'https://dialer.synapselabs.us'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const queryString = url.search
    
    const targetUrl = `${VICIDIAL_URL}/agc/vicidial.php${queryString}`
    console.log('Vicidial page GET:', targetUrl)

    const response = await fetch(targetUrl, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cookie': req.headers.get('cookie') || '',
      },
    })

    const headers = new Headers()
    headers.set('Content-Type', 'text/html; charset=utf-8')
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Access-Control-Allow-Credentials', 'true')

    // Forward cookies
    const setCookie = response.headers.get('set-cookie')
    if (setCookie) {
      headers.set('Set-Cookie', setCookie)
    }

    const text = await response.text()

    return new NextResponse(text, {
      status: response.status,
      headers,
    })
  } catch (error) {
    console.error('Vicidial page error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load VICIdial' },
      { status: 500 }
    )
  }
}
