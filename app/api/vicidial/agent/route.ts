import { NextRequest, NextResponse } from 'next/server'

const VICIDIAL_URL = process.env.VICIDIAL_URL || 'https://dialer.synapselabs.us'
const API_USER = process.env.VICIDIAL_API_USER || 'hunain'
const API_PASS = process.env.VICIDIAL_API_PASS || 'HunainBro4321'
const AGENT_USER = process.env.AGENT_USER || '2416'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { function: func, agent_user, value, phone_number, status, preview } = body

    const params = new URLSearchParams()
    params.set('source', 'crm')
    params.set('user', API_USER)
    params.set('pass', API_PASS)
    params.set('agent_user', agent_user || AGENT_USER)
    params.set('function', func)

    if (value !== undefined) params.set('value', value)
    if (phone_number !== undefined) params.set('phone_number', phone_number)
    if (status !== undefined) params.set('status', status)
    if (preview !== undefined) params.set('preview', preview)
    if (func === 'external_dial') {
      params.set('search', 'YES')
      params.set('focus', 'YES')
    }

    const url = `${VICIDIAL_URL}/agc/api.php?${params.toString()}`
    console.log('Agent API:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
    })

    const text = await response.text()
    console.log('Agent API response:', text.substring(0, 200))

    return new NextResponse(text, {
      status: response.status,
      headers: { 
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Agent API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const func = searchParams.get('function')
  const agent_user = searchParams.get('agent_user') || AGENT_USER
  const value = searchParams.get('value')
  const phone_number = searchParams.get('phone_number')
  const status = searchParams.get('status')

  const params = new URLSearchParams()
  params.set('source', 'crm')
  params.set('user', API_USER)
  params.set('pass', API_PASS)
  params.set('agent_user', agent_user)
  if (func) params.set('function', func)
  if (value) params.set('value', value)
  if (phone_number) params.set('phone_number', phone_number)
  if (status) params.set('status', status)

  try {
    const url = `${VICIDIAL_URL}/agc/api.php?${params.toString()}`
    console.log('Agent API GET:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
    })

    const text = await response.text()
    console.log('Agent API GET response:', text.substring(0, 200))

    return new NextResponse(text, {
      status: response.status,
      headers: { 
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Agent API GET error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
