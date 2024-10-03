import useSWR from "swr"
import { getWeather } from "./lib/Weather/Weather"
import { getWeatherCode } from "./lib/Weather/WeatherCode"

export const WeatherBanner = () => {
    const { data, error, isLoading } = useSWR('/weather', getWeather)
    if (isLoading) return <div>Weather Loading...</div>
    if (error) return <div>Error loading weather data</div>
    if (!data) return <div>No weather data</div>
    return <div>
        <p>
        <span style={{fontWeight: 'bold'}}>Weather @ Imperial College: </span>
            T: {data.current.temperature2m.toFixed(1)}°C (H: {data.daily.temperature2mMax[0].toFixed(1)}°C, L: {data.daily.temperature2mMin[0].toFixed(1)}°C);
            R: {data.current.rain.toFixed(0)} mm/h;
            W: {getWeatherCode(data.current.weatherCode)}
        </p>
    </div>
}