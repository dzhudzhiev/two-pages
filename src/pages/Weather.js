import { useState } from 'react';
import { YMaps, Map, Placemark } from 'react-yandex-maps';
import styled from 'styled-components';
import Header from '../components/Header';

const Container = styled.div`
  min-height: 400px;
  padding: 25px;
  background-color: rgba(0, 0, 0, 0.2);
  margin: 0 auto;

  .search-box {
    margin-bottom: 20px;
  }

  .search-box__input {
    display: block;
    width: 100%;
    padding: 15px;

    appearance: none;
    outline: none;
    border: none;
    background: none;
    background-color: rgba(255, 255, 255, 0.5);
    font-size: 20px;
  }

  .search-box__input:focus {
    background-color: rgba(255, 255, 255, 0.75);
  }

  .location {
    display: grid;
    grid-template-columns: 1fr auto;
  }

  .location__weather {
    text-align: center;
  }

  .location__temperature {
    color: #444;
    font-size: 102px;
    font-weight: 900;
    line-height: 240px;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.2);
    display: block;
  }
`;

const api = {
  key: 'fb46661c0e9d72f5fd51b489ba72ec71',
  base: 'https://api.openweathermap.org/data/2.5/'
};

function Weather() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});

  const search = event => {
    if (event.key === 'Enter') {
      fetch(
        `${api.base}weather?q=${query}&units=metric&lang=ru&APPID=${api.key}`
      )
        .then(res => res.json())
        .then(result => setWeather(result));
    }
  };

  return (
    <>
      <Header dest={{ to: '/', label: 'To The List' }} />
      <Container>
        <div className="search-box">
          <input
            type="text"
            className="search-box__input"
            placeholder="Search..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>
        {weather.main !== undefined && (
          <div className="location">
            <div className="location__weather">
              <p className="location__temperature">
                {Math.round(weather.main.temp)}&deg;C
              </p>
            </div>
            <YMaps>
              <div className="location__map">
                <Map
                  state={{
                    center: [weather.coord.lat, weather.coord.lon],
                    zoom: 5
                  }}
                  onClick={async e => {
                    const coords = e.get('coords');
                    const res = await window.ymaps.geocode(coords, {
                      kind: 'locality'
                    });
                    const nearest = res.geoObjects.get(0);

                    if (nearest !== undefined) {
                      const name = nearest.properties.get('name');

                      fetch(
                        `${api.base}weather?lat=${coords[0]}&lon=${coords[1]}&units=metric&lang=ru&APPID=${api.key}`
                      )
                        .then(res => res.json())
                        .then(result => {
                          setWeather(result);
                          setQuery(name);
                        });
                    } else {
                      setQuery('');
                    }
                  }}
                >
                  <Placemark
                    geometry={[weather.coord.lat, weather.coord.lon]}
                  />
                </Map>
              </div>
            </YMaps>
          </div>
        )}
      </Container>
    </>
  );
}

export default Weather;
