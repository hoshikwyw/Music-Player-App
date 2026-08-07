import { BsExclamationTriangle } from 'react-icons/bs'

const Error = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-[50vh] gap-3">
      <div className="w-14 h-14 flex items-center justify-center bg-danger/10 border-2 border-danger rounded-retro">
        <BsExclamationTriangle className="text-danger text-xl" />
      </div>
      <h2 className="font-bold text-base text-text-primary text-center">
        Something went wrong
      </h2>
      <p className="text-xs text-text-muted text-center">
        Please check your connection and try again.
      </p>
    </div>
  )
}

export default Error
