// const moment = require("moment");

const appId = '55f1c1e5611bc72d354bddecbb5d3397';
const DEFAULT_VALUE = '--';

const searchInput = document.querySelector('#search-input');

var cityName = document.querySelector('.city-name');
const weatherState = document.querySelector('.weather-state');
const weatherIcon = document.querySelector('.weather-icon');
var temperature = document.querySelector('.temperature');

const sunrise = document.querySelector('.sunrise');
const sunset = document.querySelector('.sunset');
const humidity = document.querySelector('.humidity');
const windSpeed = document.querySelector('.wind-speed');

searchInput.addEventListener('change', (e) => {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&appid=${appId}&units=metric&lang=fr`,
    ).then(async (res) => {
        var data = await res.json();
        // console.log("[Search Input]", data);
        cityName.innerHTML = data.name || DEFAULT_VALUE;
        weatherState.innerHTML = data.weather[0]['description'];
        var text = `http://openweathermap.org/img/wn/${data.weather[0]['icon']}@2x.png`;
        // console.log(text);
        weatherIcon.setAttribute('src', text);
        // console.log(weatherIcon);
        temperature.innerHTML = Math.round(data.main.temp);
        sunrise.innerHTML = moment.unix(data.sys.sunrise).format('H:mm');
        sunset.innerHTML = moment.unix(data.sys.sunset).format('H:mm');
        humidity.innerHTML = data.main.humidity;
        windSpeed.innerHTML = (data.wind.speed * 3.6).toFixed(2);
    });
});

// Assistant personnel intelligent
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

const recognition = new SpeechRecognition();
const synth = window.speechSynthesis;
recognition.lang = 'fr-FR';
recognition.continuous = false;

const microphone = document.querySelector('.microphone');

const speak = (text) => {
    if (synth.speaking) {
        console.error('occupé! en train de parler...');
        return;
    }

    const utter = new SpeechSynthesisUtterance(text);

    utter.onend = () => {
        console.log('SpeechSynthesisUtterance.onend');
    };
    utter.onerror = (err) => {
        console.error('SpeechSynthesisUtterance.onerror', err);
    };

    synth.speak(utter);
};

const handleVoice = (text) => {
    console.log('[text]: ', text);
    const handleTextOrigin = text;
    let handleText = text.toLowerCase();
    console.log('[handleText]: ', handleText);
    let textAnalyse;
    let location;
    let result;

    // console.log(handleText);
    if (handleText.includes('st')) {
        handleText = handleText.replace('st ', 'Saint-');
        // console.log(handleText);
    }
    if (handleText.includes('à')) {
        textAnalyse = handleText.split('à')[1].trim();
        console.log('[textAnalyse]: ', textAnalyse);
        location = textAnalyse.charAt(0).toUpperCase() + textAnalyse.slice(1);
        if (textAnalyse.includes(' ')) {
            let textAnalyse2 = textAnalyse.split(' ')[0];
            console.log('[textAnalyse2]: ', textAnalyse2);
            result = textAnalyse2.charAt(0).toUpperCase() + textAnalyse2.slice(1);
            console.log('[result]: ', result);

            location = result;
        }
    } else if (handleText.includes('de')) {
        textAnalyse = handleText.split('de')[1].trim();
        location = textAnalyse.charAt(0).toUpperCase() + textAnalyse.slice(1);
    } else {
        textAnalyse = handleText.split(' ')[0].trim();
        location = textAnalyse.charAt(0).toUpperCase() + textAnalyse.slice(1);
        console.log('[textAnalyse]: ', textAnalyse);
        // result = textAnalyse.filter((e) => e[0] == e[0].toUpperCase());
        // console.log('[result]: ', result);
        // result[result.length - 1] == [];
        // location = result[result.length - 1];
    }

    // const location = textAnalyse[textAnalyse.length - 1].trim();
    // console.log(textAnalyse[textAnalyse.length - 1]);
    // console.log(location[0]);
    // console.log(location[0] == location[0].toUpperCase);

    // if (handleTextOrigin[0] == handleTextOrigin[0].toUpperCase()) {
    //     searchInput.value = handleTextOrigin;
    //     const changeEvent = new Event("change");
    //     searchInput.dispatchEvent(changeEvent);
    //     setTimeout(() => {
    //         const textToSpeech = `Météo à  ${cityName.innerHTML}:${weatherState.innerHTML},
    //          la température est ${temperature.innerHTML} degree `;
    //         speak(textToSpeech);
    //         console.log(cityName.innerHTML);
    //     }, 1000);
    //     return;
    // }

    if (location) {
        searchInput.value = location;
        const changeEvent = new Event('change');
        searchInput.dispatchEvent(changeEvent);
        setTimeout(() => {
            console.log('[cityName.innerHTML]: ', cityName.innerHTML);
            if (cityName.innerHTML !== '--') {
                const textToSpeech = `Météo à  ${cityName.innerHTML}:${weatherState.innerHTML},
             la température est ${temperature.innerHTML} degré `;
                speak(textToSpeech);
                return;
            }
            speak('Réessayez');
        }, 1000);
        return;
    }

    if (handleText.includes('heure')) {
        const textToSpeech = `il est ${moment().hours()} heures ${moment().minutes()} minute`;
        speak(textToSpeech);
        return;
    }

    if (handleText.includes("l'heure")) {
        const textToSpeech = `il est ${moment().hours()} heures ${moment().minutes()} minute`;
        speak(textToSpeech);
        return;
    }

    speak('Réessayez');
};

microphone.addEventListener('click', (e) => {
    e.preventDefault;

    recognition.start(); // demande acceder microphone
    microphone.classList.add('recording');
});

recognition.onspeechend = () => {
    recognition.stop();
    microphone.classList.remove('recording');
};

recognition.onerror = (err) => {
    console.error(err);
    microphone.classList.remove('recording');
};

recognition.onresult = (e) => {
    // console.log("[onresult]", e);
    const text = e.results[0][0].transcript;
    handleVoice(text);
};
