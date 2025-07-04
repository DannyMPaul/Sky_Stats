import { NextRequest, NextResponse } from "next/server";

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://sky-stats.vercel.app",
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean);

const RATE_LIMIT = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60; // 60 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = RATE_LIMIT.get(ip);

  if (!userLimit || now - userLimit.timestamp > RATE_LIMIT_WINDOW) {
    RATE_LIMIT.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  
  if (!origin && !referer) return false;
  
  const requestOrigin = origin || new URL(referer!).origin;
  return ALLOWED_ORIGINS.includes(requestOrigin);
}

export async function GET(request: NextRequest) {
  try {
    if (!WEATHER_API_KEY) {
      return NextResponse.json(
        { error: "Weather API key not configured" },
        { status: 500 }
      );
    }

    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    if (!validateOrigin(request)) {
      return NextResponse.json(
        { error: "Unauthorized origin" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get("endpoint");
    const city = searchParams.get("city");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!endpoint) {
      return NextResponse.json(
        { error: "Missing endpoint parameter" },
        { status: 400 }
      );
    }

    let apiUrl: string;

    switch (endpoint) {
      case "weather":
        if (!city) {
          return NextResponse.json(
            { error: "Missing city parameter" },
            { status: 400 }
          );
        }
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${WEATHER_API_KEY}`;
        break;

      case "forecast":
        if (!city) {
          return NextResponse.json(
            { error: "Missing city parameter" },
            { status: 400 }
          );
        }
        apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${WEATHER_API_KEY}`;
        break;

      case "geocoding":
        if (!city) {
          return NextResponse.json(
            { error: "Missing city parameter" },
            { status: 400 }
          );
        }
        apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${WEATHER_API_KEY}`;
        break;

      case "air-pollution":
        if (!lat || !lon) {
          return NextResponse.json(
            { error: "Missing lat/lon parameters" },
            { status: 400 }
          );
        }
        apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`;
        break;

      default:
        return NextResponse.json(
          { error: "Invalid endpoint" },
          { status: 400 }
        );
    }

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { error: "Invalid API key" },
          { status: 401 }
        );
      }
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Location not found" },
          { status: 404 }
        );
      }
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    const requestOrigin = request.headers.get("origin");
    const allowedOrigin = requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin) 
      ? requestOrigin 
      : ALLOWED_ORIGINS[0] || "https://sky-stats.vercel.app";

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=300",
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });

  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) 
    ? origin 
    : ALLOWED_ORIGINS[0] || "https://sky-stats.vercel.app";

  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
