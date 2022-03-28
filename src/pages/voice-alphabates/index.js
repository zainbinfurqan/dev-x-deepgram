import React from 'react';

function VoiceAlphabates(props) {

    const alphabates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    const count = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]

    const handleSpeakTheNumber = async () => {

    }

    const handleGuessTheAlphabate = async () => {

    }

    return (
        <div className='bg-black d-flex flex-wrap'>
            {count.map((item, index) => {
                return (
                    <div style={{
                        boxShadow: '#3aa3a 4px 6px 17px 1px'
                    }} className='px-4 py-4 m-4 rounded bg-white cursor-pointer'>
                        <h4>{item}</h4>
                    </div>
                )
            })}
        </div>
    );
}

export default VoiceAlphabates;