import logo from './assets/logo-nlw-expert.svg'
import { NewNoteCard } from './components/NewNoteCard'
import { NoteCard } from './components/NoteCard'

export  function App() {
  return(
    <div className="mx-auto max-w-6xl my-12 space-y-6">
      <img src={logo} alt="logo of the nlw expert" />
      <form className="w-full">
      <input
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-slate-500 text-3xl font-semibold tracking-tight outline-none placeholder:text-state-500"
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard />
        <NoteCard />
        <NoteCard />
        <NoteCard />
      </div>

      <footer className="text-slate-500 text-sm">Rafa Oliveira ×͜× By Rocketseat 🚀</footer>
    </div>
  )
}

