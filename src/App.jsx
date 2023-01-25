import { useState } from 'react'
import confetti from 'canvas-confetti'
import { Square } from './components/Square.jsx'
import {TURN} from './constants'
import { checkWinnerFrom} from './logic/board.js'
import { WinnerModal } from './components/WinnerModal.jsx'
import './App.css'



function App() {

  const [board, setBoard] = useState(()=>{
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)})
  
  const [turn, setTurn]=useState(()=>{
    const turnFromStorage=window.localStorage.getItem('turn')
    return turnFromStorage ?? TURN.X
  })

  const [winner, setWinner]=useState(null)

  

  const resetGame=()=>{
    setBoard(Array(9).fill(null))
    setTurn(TURN.X)
    setWinner(null)

    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')

  }

  const checkEndGame= (newBoard)=>{

    return newBoard.every((square) => square!==null)
  }

  const updateBoard = (index) => {

    if (board[index] || winner) return

    const newBoard=[...board]
    newBoard[index] = turn
    setBoard(newBoard)

    const newTurn = turn === TURN.X ? TURN.O : TURN.X

    setTurn(newTurn)

    window.localStorage.setItem('board', JSON.stringify(newBoard) )
    window.localStorage.setItem('turn ', JSON.stringify(newBoard) )

    
    const newWinner=checkWinnerFrom(newBoard)

    if(newWinner){
      confetti()
      setWinner(newWinner)
    } else if(checkEndGame(newBoard)){
      setWinner(false)
    }
  }
  
  return (
    <main className='board'>
      <h1>tic-tac-toe</h1>
      <section className='game'>
        {
          board.map((square, index) => {
            return (
              <Square 
                key={index} 
                index={index}
                updateBoard={updateBoard}>

                {square}

              </Square>

            )
          })

        }
      </section>
        <section className='turn'>

          <Square isSelected={turn===TURN.X}>
            {TURN.X}
          </Square>

          <Square isSelected={turn===TURN.O}>
            {TURN.O}
          </Square>
        </section>
         
          <button onClick={resetGame}>Empezar de nuevo</button>

         
        <WinnerModal resetGame={resetGame} winner={winner}/>
    </main>
  )
}

export default App
