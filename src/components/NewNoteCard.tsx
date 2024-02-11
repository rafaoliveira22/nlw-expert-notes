import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { ChangeEvent, FormEvent, useState } from "react"
import { toast } from 'sonner'

interface NewNoteCardProps{
  onNoteCreated: (content: string) => void
}

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps){
  let speechRecognition: SpeechRecognition | null = null

  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [content, setContent] = useState('')

  function handleStartEditor(){
    setShouldShowOnboarding(false)
  }

  function handleContentChange(e: ChangeEvent<HTMLTextAreaElement>){
    setContent(e.target.value)
    if(e.target.value ===  ''){
      setShouldShowOnboarding(true)
    }
  }

  function handleSaveNote(e: FormEvent){
    e.preventDefault()

    if(content === ''){
      toast.error('Nota vazia...')
      return
    }

    onNoteCreated(content)
    setContent('')
    setShouldShowOnboarding(true)

    toast.success('Nota salva com sucesso.')
  }

  function handleStartRecording(){
    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    if(!isSpeechRecognitionAPIAvailable){
      toast.warning('Infelizmente o seu navegador não suporta o recurso de Gravação 😢! Utilize a opção por texto.')
      return
    }
    setIsRecording(true)
    setShouldShowOnboarding(false)

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition 
    speechRecognition = new SpeechRecognitionAPI()
    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true
    
    speechRecognition.onresult = (e) => {
      const transcription = Array.from(e.results).reduce((text: string, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    speechRecognition.onerror = (e) => {
      console.error(e)
    }

    speechRecognition.start()
    
  }

  function handleStopRecording(){
    setIsRecording(false)

    if(speechRecognition !== null){
      speechRecognition.stop()
    }
  }

  return(
    <Dialog.Root>
      <Dialog.Trigger className="flex flex-col text-left rounded-md bg-slate-700 p-5 gap-6 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none">
        <span className="text-sm font-medium text-slate-200">Adicionar nota</span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
          <Dialog.Overlay className="inset-0 fixed bg-black/60" />
          <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
            <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
              <X className="size-5"/>
            </Dialog.Close>
            
            <form className="flex flex-1 flex-col">
              <div className="flex flex-1 flex-col gap-3 p-5">
                <span className="text-sm font-medium text-slate-300">
                  Adicionar nota
                </span>
                {
                  shouldShowOnboarding ? (
                    <p className="text-sm font-medium text-slate-400">
                      Comece {' '}
                      <button 
                        type="button"
                        className="fonte-medium text-lime-400 hover:underline" 
                        onClick={handleStartRecording}>gravando uma nota
                      </button> 
                      {' '}em áudio ou se preferir{' '}
                      <button 
                        type="button" 
                        className="fonte-medium text-lime-400 hover:underline"  
                        onClick={handleStartEditor}>utilize apenas texto
                      </button>.
                    </p>
                  )
                  : (
                    <textarea 
                      autoFocus
                      className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                      onChange={handleContentChange}
                      value={content}
                    />
                    )
                  }

              </div>  

              {
              isRecording ? (
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
                onClick={handleStopRecording}
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
               Gravando... (clique aqui p/ interromper )
              </button>
              )
              : (
                <button
                  type="button"
                  className="w-full bg-lime-400 py-4 text-center text-sm text-slate-950 outline-none font-medium hover:bg-lime-500"
                  onClick={handleSaveNote}
                >
                Salvar nota
              </button>
              )
              }
            </form>
          </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
  )
}