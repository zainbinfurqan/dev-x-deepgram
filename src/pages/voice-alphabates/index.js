import React, { useEffect, useState } from 'react';
import { localStorageMethods } from "../../utils/localstorage.utilities";
import { firebaseInstance } from "../../configuration/firebase";
import { firbaseMethods } from "../../utils/firebase.utilities";

const db = firebaseInstance.firestore()

function VoiceAlphabates(props) {
    const [gameDetails, setGameDetails] = useState({})
    const [openNumbers, setOpenNumbers] = useState([])
    const [alphabates, setAlphabates] = useState([])
    const [openAlphabates, setOpenAlphabates] = useState([])
    const [wrongGuesses, setWrongGuesses] = useState(0)
    const [isNumberSaid, setIsNumberSaid] = useState(false)
    const [isAlphabateSaid, setIsAlphabateSaid] = useState(false)
    const count = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
    const alphabaticNumberToNumaric = {
        'one': 1, 'two': 2, 'three': 3, 'four': 4,
        'five': 5, 'six': 6, 'seven': 7, 'eight': 8,
        'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': 12,
        'thirteen': 13, 'fourteen': 14, 'fiveteen': 15, 'sixteen': 16,
        'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20,
        'twenty one': 21, 'twenty two': 22, 'twenty three': 23, 'twenty four': 24,
        'twenty five': 25, 'twenty six': 26,
    }

    useEffect(() => {
        getGameDetails()
        setIsNumberSaid(true)
    }, [])

    useEffect(() => {
        console.log(isNumberSaid)
        if (isNumberSaid) {
            handleSpeakTheNumber()
        }
    }, [isNumberSaid])
    useEffect(() => {
        if (isAlphabateSaid) {
            handleGuessTheAlphabate()
        }
    }, [isAlphabateSaid])

    const getGameDetails = async () => {
        try {
            const userId = await localStorageMethods.getItem('user');
            const roomDetail = await localStorageMethods.getItem('room');
            const response = db.collection('voice-the-alphabate-game').doc(roomDetail.gameId)
            response.onSnapshot(async querySnapshot => {
                setGameDetails(querySnapshot.data())
                setOpenNumbers(querySnapshot.data().openNumbers)
                setAlphabates(querySnapshot.data().alphabates)
                setOpenAlphabates(querySnapshot.data().openAlphabates)
            })

        } catch (error) {
            console.log(error)
        }
    }
    const handleSpeakTheNumber = async (value) => {
        const roomDetail = await localStorageMethods.getItem('room');
        const tempOpenNumbers = openNumbers
        let mediaRecorder = null;
        console.log('handleSpeakTheNumber')
        await window.navigator.mediaDevices.getUserMedia({ audio: true }).then((res) => {
            mediaRecorder = new MediaRecorder(res, {
                audio: true,
            });
        })
        let socket = new WebSocket("wss://api.deepgram.com/v1/listen", [
            "token",
            "06e1b33e25def49e8c87daa5940991afdc34b0b5",
        ]);
        socket.onopen = () => {
            mediaRecorder.addEventListener("dataavailable", async (event) => {
                if (event.data.size > 0 && socket.readyState == 1) {
                    socket.send(event.data);
                }
            });
            mediaRecorder.start(500);
        };
        socket.onmessage = async (message) => {
            const received = JSON.parse(message.data);
            const transcript = received.channel.alternatives[0].transcript;
            if (transcript && received.is_final) {
                console.log(transcript)
                console.log(alphabaticNumberToNumaric[transcript])
                if (alphabaticNumberToNumaric[transcript] && alphabaticNumberToNumaric[transcript] > 0 && alphabaticNumberToNumaric[transcript] <= 26 && !tempOpenNumbers.includes(alphabaticNumberToNumaric[transcript])) {
                    tempOpenNumbers.push(alphabaticNumberToNumaric[transcript]);
                    setOpenNumbers(tempOpenNumbers)
                    gameDetails.openNumbers = tempOpenNumbers
                    await db.collection('voice-the-alphabate-game').doc(roomDetail.gameId).update({
                        ...gameDetails
                    })
                    setIsNumberSaid(false)
                    setIsAlphabateSaid(true)
                    mediaRecorder.stop();
                }
            }
        };
    }

    const handleGuessTheAlphabate = async (value,) => {
        const roomDetail = await localStorageMethods.getItem('room');

        let tempWrongGuesses = wrongGuesses
        let mediaRecorder = null;

        await window.navigator.mediaDevices.getUserMedia({ audio: true }).then((res) => {
            mediaRecorder = new MediaRecorder(res, {
                audio: true,
            });
        })
        let socket = new WebSocket("wss://api.deepgram.com/v1/listen", [
            "token",
            "06e1b33e25def49e8c87daa5940991afdc34b0b5",
        ]);
        socket.onopen = () => {
            mediaRecorder.addEventListener("dataavailable", async (event) => {
                if (event.data.size > 0 && socket.readyState == 1) {
                    socket.send(event.data);
                }
            });
            mediaRecorder.start(500);
        };
        socket.onmessage = async (message) => {
            const received = JSON.parse(message.data);
            const transcript = received.channel.alternatives[0].transcript;
            if (transcript && received.is_final) {
                console.log(transcript)
                if (alphabates[openNumbers.length - 1] == alphabaticNumberToNumaric[transcript]) {
                    gameDetails.riteAnswers++
                    gameDetails.openAlphabates.push(alphabates[openNumbers.length - 1])
                    await db.collection('voice-the-alphabate-game').doc(roomDetail.gameId).update({
                        ...gameDetails
                    })
                } else {
                    tempWrongGuesses = tempWrongGuesses + 1
                    setWrongGuesses(tempWrongGuesses)
                    console.log(tempWrongGuesses)
                    if (tempWrongGuesses >= 5) {
                        gameDetails.wrongAnswers = 0
                        gameDetails.riteAnswers = 0
                        gameDetails.openAlphabates = []
                        gameDetails.openNumbers = []
                        await db.collection('voice-the-alphabate-game').doc(roomDetail.gameId).update({
                            ...gameDetails
                        })
                        setWrongGuesses(0)
                    } else {
                        gameDetails.wrongAnswers = gameDetails.wrongAnswers + 1
                        await db.collection('voice-the-alphabate-game').doc(roomDetail.gameId).update({
                            ...gameDetails
                        })
                    }

                }
            }
        };
    }

    return (
        <div className='voice-alphabate-game-container p-2'>
            <h2 style={{
                fontWeight: 'bolder',
                textAlign: 'center',
                padding: '16px',
                fontSize: '57px',
                color: '#36c0ff',
                textShadow: '2px 2px 5px #0c0b0b',
            }}>Guess the Alphabate</h2>
            {Object.keys(gameDetails).length > 0 && <div style={{
                width: 'fit-content'
            }} className='px-4 mx-4 rounded text-dark font-weight-bold bg-white mw-100'>
                <p>Score:</p>
                <p>LifeLine Left: {5 - wrongGuesses}</p>
                <p>Wrong Answers: {gameDetails.wrongAnswers}</p>
                <p>Right Answers: {gameDetails.riteAnswers}</p>
            </div>}

            <div className='bg-black d-flex flex-wrap '>
                {count.map((item, index) => {
                    return (
                        <div onClick={() => handleSpeakTheNumber(item)} style={{
                            backgroundColor: 'darkorchid',
                            boxShadow: '#3aa3a 4px 6px 17px 1px'
                        }} className='px-4 py-4 m-4 rounded text-white  cursor-pointer'>
                            {!openNumbers.includes(item) && <h4 className='font-weight-bold'>{item}</h4>}
                            {openNumbers.includes(item) &&
                                // <h4 onClick={() => handleGuessTheAlphabate(alphabates[index], index)}>
                                <h4 className='font-weight-bold' onClick={() => handleGuessTheAlphabate(Math.floor(Math.random() * 100), index)}>
                                    {alphabates[index]}
                                </h4>}
                        </div>
                    )
                })}
            </div >
        </div>
    );
}

export default VoiceAlphabates;