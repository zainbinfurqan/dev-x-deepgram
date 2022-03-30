import React from 'react';
import { Link } from 'react-router-dom';

function GamesList(props) {

    const gamesList = [
        { id: 1, title: 'Tic Tac Toe', link: '/game-tictactoe-home', game: 'tictactoe' },
        { id: 2, title: 'Voice the Alphabate', link: '/game-voice-alphabates-home', game: 'voicealphabates' },
    ]

    return (
        <div className='d-flex'>
            {gamesList.map((item, index) => {
                return (
                    <Link
                        // className={item.game !== 'tictactoe' && 'pointer-events'} 
                        style={{
                            color: 'black',
                            textDecoration: 'none'
                        }} to={item.link}>
                        <div aria-disabled={true} style={{
                            boxShadow: '#3a3a3a 4px 6px 17px 1px'
                        }} className={`px-3 py-5 m-5 rounded bg-white cursor-pointer `}>
                            {/* {item.game !== 'tictactoe' && <p style={{ fontWeight: 'bold', position: 'absolute', margin: '30px 0px' }}>Currently Unavailable</p>} */}
                            <h4>{item.title}</h4>
                        </div>
                    </Link>
                )
            })}
        </div>
    );
}

export default GamesList;