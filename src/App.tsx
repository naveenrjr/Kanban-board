import './index.css'
import './App.css'
import KanbanBoard from './components/KanbanBoard'
// import ThemeToggle from './components/ThemeToggle'

function App() {
 

  return (
      <div className='relative'>
        {/* <div className='absolute right-4 top-4'>
          <ThemeToggle/>
        </div> */}
        <KanbanBoard/>
      </div>
  )
}

export default App
