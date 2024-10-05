import useSWR from "swr"
import { getWeather, willRain } from "./lib/Weather/Weather"
import { getWeatherCode } from "./lib/Weather/WeatherCode"

export const WeatherBanner = () => {
    const { data, error, isLoading } = useSWR('/weather', getWeather)
    if (isLoading) return <div>Weather Loading...</div>
    if (error) return <div>Error loading weather data</div>
    if (!data) return <div>No weather data</div>
    const rain = willRain(data)
    return <p style={{ marginBottom: 0 }}>
        <span style={{ fontWeight: 'bold' }}>Weather @ Imperial College: </span>
        W: {getWeatherCode(data.current.weatherCode)}
        {rain.WillRain ? `🌧️ will rain max ${rain.H} mm/h; ` : '; '}
        T: {data.current.temperature2m.toFixed(1)}°C (L: {data.daily.temperature2mMin[0].toFixed(1)}°C, H: {data.daily.temperature2mMax[0].toFixed(1)}°C);
        R: {data.current.rain.toFixed(0)} mm/h
    </p>
}