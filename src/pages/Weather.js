import { useState, useCallback } from 'react';
import { YMaps, Map, Placemark } from 'react-yandex-maps';
import Autosuggest from 'react-autosuggest';
import debounce from 'lodash.debounce';
import styled from 'styled-components';
import Header from '../components/Header';
import './Weather.css';

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

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return <span>{suggestion.name}</span>;
}

function Weather() {
  const [weather, setWeather] = useState({});
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // eslint-disable-next-line
  const loadSuggestions = useCallback(
    debounce(async searchText => {
      const result = await fetch(
        'https://places-dsn.algolia.net/1/places/query',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Algolia-Application-Id': 'pl0SOC6TFYAY',
            'X-Algolia-API-Key': 'ef7ccda39f37f5c60bc6e0bfdd82eff7'
          },
          body: JSON.stringify({
            query: searchText,
            type: 'city',
            language: 'ru',
            hitsPerPage: 5
          })
        }
      ).then(res => res.json());

      setSuggestions(
        result.hits.map(({ locale_names, _geoloc }) => ({
          name: locale_names[0],
          lat: _geoloc.lat,
          lng: _geoloc.lng
        }))
      );
    }, 1000),
    []
  );

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    loadSuggestions(value);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    placeholder: 'Введите город',
    value,
    onChange
  };

  const getWeather = async (lat, lon) => {
    const result = await fetch(
      `${api.base}weather?lat=${lat}&lon=${lon}&units=metric&appid=${api.key}`
    ).then(res => res.json());
    setWeather(result);
  };

  return (
    <>
      <Header dest={{ to: '/', label: 'To The List' }} />
      <Container>
        <div className="search-box">
          <div>
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={onSuggestionsFetchRequested}
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              onSuggestionSelected={(event, { suggestion }) => {
                const { lat, lng } = suggestion;
                getWeather(lat, lng);
              }}
              inputProps={inputProps}
            />
          </div>
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
                          setValue(name);
                        });
                    } else {
                      setValue('');
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
