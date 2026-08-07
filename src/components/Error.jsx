import { BsExclamationTriangle } from 'react-icons/bs'

const Error = ({
  title = 'Something went wrong',
  message = 'Check your connection and try again.',
}) => (
  <div className="flex flex-col justify-center items-center w-full h-[50vh] gap-3 px-4">
    <div
      className="w-14 h-14 flex items-center justify-center rounded-glass-sm"
      style={{
        background: 'color-mix(in srgb, var(--color-danger) 14%, transparent)',
        border: '1px solid color-mix(in srgb, var(--color-danger) 40%, transparent)',
      }}
    >
      <BsExclamationTriangle className="text-danger text-xl" />
    </div>
    <h2 className="font-bold text-base text-text-primary text-center">{title}</h2>
    <p className="text-xs text-text-muted text-center max-w-xs">{message}</p>
  </div>
)

export default Error
