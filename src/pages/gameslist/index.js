import React from 'react';
import { Link } from 'react-router-dom';

function GamesList(props) {

    const gamesList = [
        { id: 1, title: 'Tic Tac Toe' },
        { id: 2, title: 'Voice the Alphabate' },
    ]

    return (
        <div className='d-flex'>
            {gamesList.map((item, index) => {
                return (
                    <Link className='' style={{
                        color: 'black',
                        textDecoration: 'none'
                    }} to="/game-tictactoe-home">
                        <div style={{
                            boxShadow: '#3a3a3a 4px 6px 17px 1px'
                        }} className='px-3 py-5 m-5 rounded bg-white cursor-pointer'>
                            <h4>{item.title}</h4>
                        </div>
                    </Link>
                )
            })}
        </div>
    );
}

export default GamesList;